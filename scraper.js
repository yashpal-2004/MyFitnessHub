import fs from 'fs';
import https from 'https';

const links = JSON.parse(fs.readFileSync('exercise_links.json', 'utf8'));

// Filter out category pages
const exercisePaths = links.filter(link => 
  !link.endsWith('-exercise-guides') && 
  link !== '/pages/workout-exercise-guides'
);

console.log(`Starting image scraper for ${exercisePaths.length} exercises...`);

const imageMap = {};
let completed = 0;

// Fetch function using built-in https module
const fetchPage = (path) => {
  return new Promise((resolve) => {
    const url = `https://www.simplyfitness.com${path}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        // Regex to find shopify cdn images for the exercise
        // Usually contains files/Exercise-Name_..._600x600.png or similar
        const imgRegex = /https:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'()]+_(?:600x600|480x480|800x800|1024x1024)\.(?:png|jpg|jpeg|webp)/gi;
        const matches = data.match(imgRegex);
        
        if (matches && matches.length > 0) {
          // Get the first high-quality image match
          const imageUrl = matches[0];
          const exerciseId = path.replace('/pages/', '');
          imageMap[exerciseId] = imageUrl;
          console.log(`[${++completed}/${exercisePaths.length}] Found: ${exerciseId} -> ${imageUrl.substring(0, 60)}...`);
        } else {
          // Backup regex for any image in the main content wrapper
          const fallbackRegex = /https:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'()]+_(?:600x600|480x480|800x800|1024x1024)\.(?:png|jpg|jpeg|webp)/gi;
          const fallbackMatches = data.match(fallbackRegex);
          if (fallbackMatches && fallbackMatches.length > 0) {
            const imageUrl = fallbackMatches[0];
            const exerciseId = path.replace('/pages/', '');
            imageMap[exerciseId] = imageUrl;
            console.log(`[${++completed}/${exercisePaths.length}] Fallback: ${exerciseId} -> ${imageUrl.substring(0, 60)}...`);
          } else {
            console.log(`[${++completed}/${exercisePaths.length}] No image found for: ${path}`);
          }
        }
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error fetching ${path}:`, err.message);
      resolve();
    });
  });
};

// Run fetches in chunks of 5 concurrent requests to be polite but fast
const run = async () => {
  const chunkSize = 8;
  for (let i = 0; i < exercisePaths.length; i += chunkSize) {
    const chunk = exercisePaths.slice(i, i + chunkSize);
    await Promise.all(chunk.map(path => fetchPage(path)));
    // Save progress periodically
    fs.writeFileSync('exercise_images.json', JSON.stringify(imageMap, null, 2));
  }
  console.log('Scraping complete. Map saved to exercise_images.json');
};

run();

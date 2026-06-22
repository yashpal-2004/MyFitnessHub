import type { Exercise } from '../types';

export interface ExerciseWithImage extends Exercise {
  image: string;
}

export const EXERCISES: ExerciseWithImage[] = [
  {
    "id": "barbell-bench-press",
    "name": "Barbell Bench Press",
    "category": "Chest",
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Lie flat on your back on a bench.",
      "Grip the barbell with hands slightly wider than shoulder-width.",
      "Unrack the bar and lower it slowly to your mid-chest.",
      "Push the bar back up powerfully until your arms are fully extended."
    ],
    "commonMistakes": [
      "Bouncing the bar off your chest",
      "Flaring elbows out too wide",
      "Lifting hips off the bench"
    ],
    "image": "/exercises/barbell-bench-press.png"
  },
  {
    "id": "dumbbell-bench-press",
    "name": "Dumbbell Bench Press",
    "category": "Chest",
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Lie flat on a bench holding dumbbells at chest level.",
      "Press the dumbbells straight up until arms are locked.",
      "Lower them slowly to the starting position."
    ],
    "commonMistakes": [
      "Short range of motion",
      "Losing control of weights"
    ],
    "image": "/exercises/dumbbell-bench-press.png"
  },
  {
    "id": "pec-deck",
    "name": "Pec Deck",
    "category": "Chest",
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "instructions": [
      "Adjust the seat height so the handles are at chest level.",
      "Sit back and grip the handles, forearms flat against the pads.",
      "Squeeze the handles together in front of your chest.",
      "Slowly return to the starting position."
    ],
    "commonMistakes": [
      "Letting weight plates slam",
      "Using too much momentum"
    ],
    "image": "/exercises/pec-deck.png"
  },
  {
    "id": "incline-dumbbell-bench-press",
    "name": "Incline Dumbbell Bench Press",
    "category": "Chest",
    "primaryMuscle": "Upper Pectoralis",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Set an incline bench to 30-45 degrees.",
      "Sit back holding dumbbells at chest level with an overhand grip.",
      "Press the dumbbells straight up over your chest.",
      "Lower the weights slowly back to the sides of your chest."
    ],
    "commonMistakes": [
      "Clashing dumbbells at the top",
      "Incorrect bench angle (too steep targets shoulders too much)"
    ],
    "image": "/exercises/incline-dumbbell-bench-press.png"
  },
  {
    "id": "cable-crossover",
    "name": "Cable Crossover",
    "category": "Chest",
    "primaryMuscle": "Lower Pectoralis",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "instructions": [
      "Set pulleys to the high position and hold one handle in each hand.",
      "Step forward between the pulleys, leaning slightly forward.",
      "Bring your hands together in an arc motion in front of your waist.",
      "Slowly return to the starting position."
    ],
    "commonMistakes": [
      "Bending elbows too much",
      "Not squeezing at the bottom"
    ],
    "image": "/exercises/cable-crossover.png"
  },
  {
    "id": "incline-barbell-bench-press",
    "name": "Incline Barbell Bench Press",
    "category": "Chest",
    "primaryMuscle": "Upper Pectoralis",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Lie on an incline bench set to about 30-45 degrees.",
      "Grip the bar with hands wider than shoulder-width.",
      "Lower the bar to your upper chest.",
      "Press the bar straight up."
    ],
    "commonMistakes": [
      "Bouncing the bar",
      "Uneven pressing"
    ],
    "image": "/exercises/incline-barbell-bench-press.png"
  },
  {
    "id": "dumbbell-fly",
    "name": "Dumbbell Fly",
    "category": "Chest",
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Lie on a flat bench holding dumbbells above chest with slight elbow bend.",
      "Lower dumbbells out to sides in wide arc until chest stretch is felt.",
      "Reverse the motion to return to start."
    ],
    "commonMistakes": [
      "Bending elbows too much (making it a press)",
      "Excessive stretching"
    ],
    "image": "/exercises/dumbbell-fly.png"
  },
  {
    "id": "push-ups",
    "name": "Push Ups",
    "category": "Chest",
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Triceps",
      "Core",
      "Anterior Deltoids"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "Start in plank position with hands slightly wider than shoulders.",
      "Lower body until chest almost touches the floor.",
      "Push body back up to starting position."
    ],
    "commonMistakes": [
      "Sagging hips",
      "Looking straight down or up"
    ],
    "image": "/exercises/push-ups.png"
  },
  {
    "id": "dumbbell-declined-bench-press",
    "name": "Dumbbell Declined Bench Press",
    "category": "Chest",
    "primaryMuscle": "Lower Pectoralis",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Advanced",
    "instructions": [
      "Lie on decline bench holding dumbbells.",
      "Press dumbbells up over lower chest.",
      "Lower them slowly to starting position."
    ],
    "commonMistakes": [
      "Banging weights",
      "Unequal balance"
    ],
    "image": "/exercises/dumbbell-declined-bench-press.png"
  },
  {
    "id": "barbell-declined-bench-press",
    "name": "Barbell Declined Bench Press",
    "category": "Chest",
    "primaryMuscle": "Lower Pectoralis",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "instructions": [
      "Secure feet under pads on decline bench and lie back.",
      "Unrack barbell and lower it to lower chest.",
      "Press the bar back up."
    ],
    "commonMistakes": [
      "Insecure foot placement",
      "Incorrect bar path"
    ],
    "image": "/exercises/barbell-declined-bench-press.png"
  },
  {
    "id": "incline-dumbbell-fly",
    "name": "Incline Dumbbell Fly",
    "category": "Chest",
    "primaryMuscle": "Upper Pectoralis",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Lie on incline bench holding dumbbells above upper chest with slight elbow bend.",
      "Lower weights in wide arc to the sides.",
      "Return to start by contracting chest muscles."
    ],
    "commonMistakes": [
      "Using too heavy weights",
      "Fast drops"
    ],
    "image": "/exercises/incline-dumbbell-fly.png"
  },
  {
    "id": "chest-press-machine",
    "name": "Chest Press Machine",
    "category": "Chest",
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "instructions": [
      "Adjust seat so handles align with mid-chest.",
      "Press handles forward until arms are straight.",
      "Return slowly to the starting position."
    ],
    "commonMistakes": [
      "Arching back off seat",
      "Hyper-extending elbows"
    ],
    "image": "/exercises/chest-press-machine.png"
  },
  {
    "id": "dumbbell-overhead-triceps-extension",
    "name": "Dumbbell Overhead Triceps Extension",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Sit or stand holding a dumbbell with both hands overhead.",
      "Keep upper arms near head and bend elbows to lower weight behind head.",
      "Push weight back up."
    ],
    "commonMistakes": [
      "Flaring elbows out too wide",
      "Arching lower back excessively"
    ],
    "image": "/exercises/dumbbell-overhead-triceps-extension.png"
  },
  {
    "id": "one-arm-dumbbell-overhead-triceps-extension",
    "name": "One-Arm Dumbbell Overhead Triceps Extension",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Sit or stand holding a dumbbell in one hand directly overhead.",
      "Keep your upper arm stationary and near your head, bending at the elbow to lower the dumbbell behind your head.",
      "Push the dumbbell back up to the starting position by contracting your triceps."
    ],
    "commonMistakes": [
      "Flaring the elbow out to the side",
      "Arching the lower back excessively"
    ],
    "image": "/exercises/one-arm-dumbbell-overhead-triceps-extension.png"
  },
  {
    "id": "close-grip-bench-press",
    "name": "Close Grip Bench Press",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Lie flat on bench. Grip bar with hands shoulder-width apart.",
      "Lower bar to mid-chest while keeping elbows close to body.",
      "Press bar up focus on triceps."
    ],
    "commonMistakes": [
      "Hands too close (strain on wrists)",
      "Bouncing bar"
    ],
    "image": "/exercises/close-grip-bench-press.png"
  },
  {
    "id": "kickback",
    "name": "Kickback",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Place one knee and hand on bench, torso parallel to floor.",
      "Hold dumbbell in other hand, elbow tucked at rib cage.",
      "Extend arm straight back.",
      "Slowly return to start."
    ],
    "commonMistakes": [
      "Swinging upper arm",
      "Dropping elbow"
    ],
    "image": "/exercises/kickback.png"
  },
  {
    "id": "cable-rope-pushdown",
    "name": "Cable Rope Pushdown",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "instructions": [
      "Attach rope to high pulley and hold ends.",
      "Keep elbows close to torso.",
      "Push down and flare rope outward at the bottom.",
      "Control the return."
    ],
    "commonMistakes": [
      "Using shoulder force",
      "Short range of motion"
    ],
    "image": "/exercises/cable-rope-pushdown.png"
  },
  {
    "id": "triceps-pressdown",
    "name": "Triceps Pressdown",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "instructions": [
      "Stand facing pulley machine holding bar attachment at chest height.",
      "Tuck elbows in to sides.",
      "Push bar down until arms are fully extended.",
      "Return slowly to chest height."
    ],
    "commonMistakes": [
      "Elbows moving away from ribs",
      "Leaning too far forward"
    ],
    "image": "/exercises/triceps-pressdown.png"
  },
  {
    "id": "lying-triceps-extension",
    "name": "Lying Triceps Extension",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Lie on a bench holding an EZ bar or barbell over chest.",
      "Keep upper arms stationary and bend elbows to lower bar towards forehead.",
      "Contract triceps to extend arms back to start."
    ],
    "commonMistakes": [
      "Moving upper arms/elbows back and forth",
      "Dropping bar too fast"
    ],
    "image": "/exercises/lying-triceps-extension.png"
  },
  {
    "id": "seated-barbell-french-press",
    "name": "Seated Barbell French Press",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Sit holding barbell overhead.",
      "Lower bar behind head by bending elbows.",
      "Extend upward."
    ],
    "commonMistakes": [
      "Over-arching lower back"
    ],
    "image": "/exercises/seated-barbell-french-press.png"
  },
  {
    "id": "reverse-grip-cable-triceps-extension",
    "name": "Reverse Grip Cable Triceps Extension",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "instructions": [
      "Use straight bar on high pulley with underhand (palms up) grip.",
      "Tuck elbows and push down until arms are straight.",
      "Slowly release."
    ],
    "commonMistakes": [
      "Losing wrist lock",
      "Not extending fully"
    ],
    "image": "/exercises/reverse-grip-cable-triceps-extension.png"
  },
  {
    "id": "single-arm-cable-triceps-extension",
    "name": "Single-Arm Cable Triceps Extension",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "instructions": [
      "Grip single handle on cable station.",
      "Keep elbow locked beside torso.",
      "Push down to full extension.",
      "Return under control."
    ],
    "commonMistakes": [
      "Moving body to push weight",
      "Using wrist to yank"
    ],
    "image": "/exercises/single-arm-cable-triceps-extension.png"
  },
  {
    "id": "single-arm-cable-triceps-extension-supinated",
    "name": "Single-Arm Cable Triceps Extension (Supinated Grip)",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "instructions": [
      "Grip single handle with palm up.",
      "Keep elbow stationary.",
      "Push down until arm is fully extended."
    ],
    "commonMistakes": [
      "Allowing wrist to bend"
    ],
    "image": "/exercises/single-arm-cable-triceps-extension-supinated.png"
  },
  {
    "id": "lying-dumbbell-triceps-extension",
    "name": "Lying Dumbbell Triceps Extension",
    "category": "Triceps",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Lie flat holding dumbbells straight up.",
      "Lower weights to sides of head by bending only at elbows.",
      "Extend back to start."
    ],
    "commonMistakes": [
      "Moving elbows forward"
    ],
    "image": "/exercises/lying-dumbbell-triceps-extension.png"
  },
  {
    "id": "barbell-curl",
    "name": "Barbell Curl",
    "category": "Biceps",
    "primaryMuscle": "Biceps Brachii",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "instructions": [
      "Stand straight holding barbell with underhand grip at thighs.",
      "Keep elbows close to torso and curl bar toward shoulders.",
      "Slowly lower bar back to thighs."
    ],
    "commonMistakes": [
      "Swinging body to lift weight",
      "Not completing full range"
    ],
    "image": "/exercises/barbell-curl.png"
  },
  {
    "id": "alternating-dumbbell-curl",
    "name": "Alternating Dumbbell Curl",
    "category": "Biceps",
    "primaryMuscle": "Biceps Brachii",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Stand holding dumbbells at sides.",
      "Curl one dumbbell up, rotating palm to face shoulder.",
      "Lower it, then repeat with other arm."
    ],
    "commonMistakes": [
      "Swinging shoulders",
      "Not rotating wrists"
    ],
    "image": "/exercises/alternating-dumbbell-curl.png"
  },
  {
    "id": "incline-dumbbell-curl",
    "name": "Incline Dumbbell Curl",
    "category": "Biceps",
    "primaryMuscle": "Biceps Brachii (Long Head)",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Sit on 45-degree incline bench with dumbbells hanging down.",
      "Keep elbows back and curl dumbbells up.",
      "Slowly lower."
    ],
    "commonMistakes": [
      "Flaring elbows out",
      "Letting shoulders roll forward"
    ],
    "image": "/exercises/incline-dumbbell-curl.png"
  },
  {
    "id": "ez-barbell-curl",
    "name": "EZ Barbell Curl",
    "category": "Biceps",
    "primaryMuscle": "Biceps Brachii",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "instructions": [
      "Hold EZ bar at outer grips.",
      "Curl bar up keeping elbows stationary.",
      "Slowly lower."
    ],
    "commonMistakes": [
      "Moving elbows forward"
    ],
    "image": "/exercises/ez-barbell-curl.png"
  },
  {
    "id": "rope-cable-curl",
    "name": "Rope Cable Curl",
    "category": "Biceps",
    "primaryMuscle": "Biceps Brachii",
    "secondaryMuscles": [
      "Brachialis",
      "Forearms"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "instructions": [
      "Attach rope to low pulley and hold with palms facing each other.",
      "Curl arms up, keeping elbows tucked.",
      "Control the lower."
    ],
    "commonMistakes": [
      "Leaning back"
    ],
    "image": "/exercises/rope-cable-curl.png"
  },
  {
    "id": "ez-barbell-preacher-curl",
    "name": "EZ Barbell Preacher Curl",
    "category": "Biceps",
    "primaryMuscle": "Biceps Brachii (Short Head)",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Sit on preacher bench with upper arms resting on pad.",
      "Hold EZ bar underhand and curl it upward.",
      "Lower bar fully until arms are extended."
    ],
    "commonMistakes": [
      "Lifting elbows off pad",
      "Not extending fully"
    ],
    "image": "/exercises/ez-barbell-preacher-curl.png"
  },
  {
    "id": "hammer-curl",
    "name": "Hammer Curl",
    "category": "Biceps",
    "primaryMuscle": "Brachioradialis",
    "secondaryMuscles": [
      "Biceps Brachii",
      "Brachialis"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Stand holding dumbbells with neutral grip (palms facing each other).",
      "Curl weights up keeping palms facing in.",
      "Lower with control."
    ],
    "commonMistakes": [
      "Swinging arms",
      "Not flexing fully"
    ],
    "image": "/exercises/hammer-curl.png"
  },
  {
    "id": "dumbbell-lateral-raise",
    "name": "Dumbbell Lateral Raise",
    "category": "Shoulders",
    "primaryMuscle": "Lateral Deltoids",
    "secondaryMuscles": [
      "Trapezius"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Stand holding dumbbells at sides, slight forward lean.",
      "Raise dumbbells out to sides in wide arc until parallel to floor.",
      "Slowly lower back down."
    ],
    "commonMistakes": [
      "Swinging weights",
      "Leading with hands instead of elbows"
    ],
    "image": "/exercises/dumbbell-lateral-raise.png"
  },
  {
    "id": "dumbbell-shoulder-press",
    "name": "Dumbbell Shoulder Press",
    "category": "Shoulders",
    "primaryMuscle": "Anterior Deltoids",
    "secondaryMuscles": [
      "Triceps",
      "Lateral Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Sit or stand holding dumbbells at shoulder level, palms forward.",
      "Press dumbbells straight up overhead until arms are extended.",
      "Lower weights back to shoulder level."
    ],
    "commonMistakes": [
      "Arching lower back",
      "Banging dumbbells at top"
    ],
    "image": "/exercises/dumbbell-shoulder-press.png"
  },
  {
    "id": "straight-bar-low-pulley-cable-curl",
    "name": "Straight Bar Low Pulley Cable Curl",
    "category": "Biceps",
    "primaryMuscle": "Biceps Brachii",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "instructions": [
      "Grip straight bar attached to low pulley underhand.",
      "Curl bar up and lower with control."
    ],
    "commonMistakes": [
      "Bending knees to assist"
    ],
    "image": "/exercises/straight-bar-low-pulley-cable-curl.png"
  },
  {
    "id": "reverse-barbell-curl",
    "name": "Reverse Barbell Curl",
    "category": "Biceps",
    "primaryMuscle": "Brachioradialis",
    "secondaryMuscles": [
      "Forearms",
      "Biceps"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Stand holding barbell with overhand grip (palms down).",
      "Curl bar up keeping wrists straight.",
      "Lower slowly."
    ],
    "commonMistakes": [
      "Bending wrists backward at top"
    ],
    "image": "/exercises/reverse-barbell-curl.png"
  },
  {
    "id": "single-arm-low-pulley-cable-curl",
    "name": "Single-Arm Low Pulley Cable Curl",
    "category": "Biceps",
    "primaryMuscle": "Biceps Brachii",
    "secondaryMuscles": [],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "instructions": [
      "Hold single handle attached to low pulley.",
      "Curl handle up toward shoulder.",
      "Return slowly."
    ],
    "commonMistakes": [
      "Swinging torso"
    ],
    "image": "/exercises/single-arm-low-pulley-cable-curl.png"
  },
  {
    "id": "dumbbell-concentration-curl",
    "name": "Dumbbell Concentration Curl",
    "category": "Biceps",
    "primaryMuscle": "Biceps Brachii",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Sit on bench, feet wide, holding dumbbell.",
      "Rest back of upper arm against inside of thigh.",
      "Curl dumbbell up towards face.",
      "Lower slowly."
    ],
    "commonMistakes": [
      "Using thigh to push arm up",
      "Rounding back excessively"
    ],
    "image": "/exercises/dumbbell-concentration-curl.png"
  },
  {
    "id": "barbell-front-raise",
    "name": "Barbell Front Raise",
    "category": "Shoulders",
    "primaryMuscle": "Anterior Deltoids",
    "secondaryMuscles": [],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Hold barbell at thighs with overhand grip.",
      "Raise bar forward to shoulder level.",
      "Lower slowly."
    ],
    "commonMistakes": [
      "Swinging body"
    ],
    "image": "/exercises/barbell-front-raise.png"
  },
  {
    "id": "cable-one-arm-lateral-raise",
    "name": "Cable One-Arm Lateral Raise",
    "category": "Shoulders",
    "primaryMuscle": "Lateral Deltoids",
    "secondaryMuscles": [
      "Trapezius"
    ],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "instructions": [
      "Hold low pulley handle across body.",
      "Raise handle out to side to shoulder height.",
      "Return slowly."
    ],
    "commonMistakes": [
      "Shrugging shoulders up"
    ],
    "image": "/exercises/cable-one-arm-lateral-raise.png"
  },
  {
    "id": "single-arm-cable-front-raise",
    "name": "Single-Arm Cable Front Raise",
    "category": "Shoulders",
    "primaryMuscle": "Anterior Deltoids",
    "secondaryMuscles": [],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "instructions": [
      "Hold low pulley handle behind your back or between legs.",
      "Raise arm straight forward to shoulder height."
    ],
    "commonMistakes": [
      "Rotating torso"
    ],
    "image": "/exercises/single-arm-cable-front-raise.png"
  },
  {
    "id": "seated-barbell-shoulder-press",
    "name": "Seated Barbell Shoulder Press",
    "category": "Shoulders",
    "primaryMuscle": "Anterior Deltoids",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Sit holding barbell at collarbone.",
      "Press bar straight up overhead."
    ],
    "commonMistakes": [
      "Flaring elbows out"
    ],
    "image": "/exercises/seated-barbell-shoulder-press.png"
  },
  {
    "id": "smith-machine-shoulder-press",
    "name": "Smith Machine Shoulder Press",
    "category": "Shoulders",
    "primaryMuscle": "Anterior Deltoids",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Machine",
    "difficulty": "Intermediate",
    "instructions": [
      "Sit at smith machine, bar path in front of face.",
      "Unrack bar and lower to upper chest level.",
      "Press bar straight up."
    ],
    "commonMistakes": [
      "Incorrect bench alignment"
    ],
    "image": "/exercises/smith-machine-shoulder-press.png"
  },
  {
    "id": "dumbbell-front-raise",
    "name": "Dumbbell Front Raise",
    "category": "Shoulders",
    "primaryMuscle": "Anterior Deltoids",
    "secondaryMuscles": [
      "Chest"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Stand holding dumbbells in front of thighs.",
      "Raise one dumbbell straight out in front to shoulder height.",
      "Lower and repeat with other arm."
    ],
    "commonMistakes": [
      "Using body swing",
      "Raising too high"
    ],
    "image": "/exercises/dumbbell-front-raise.png"
  },
  {
    "id": "alt-dumbbell-front-raise-neutral",
    "name": "Alternate Dumbbell Front Raise Neutral Grip",
    "category": "Shoulders",
    "primaryMuscle": "Anterior Deltoids",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Hold dumbbells with palms facing each other.",
      "Raise forward."
    ],
    "commonMistakes": [
      "Leaning back"
    ],
    "image": "/exercises/alt-dumbbell-front-raise-neutral.png"
  },
  {
    "id": "standing-barbell-shoulder-press",
    "name": "Standing Barbell Shoulder Press",
    "category": "Shoulders",
    "primaryMuscle": "Anterior Deltoids",
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Stand holding barbell at chest level.",
      "Press overhead while squeezing core and glutes."
    ],
    "commonMistakes": [
      "Arching lower back"
    ],
    "image": "/exercises/standing-barbell-shoulder-press.png"
  },
  {
    "id": "two-handed-dumbbell-front-raise",
    "name": "Two-Handed Dumbbell Front Raise",
    "category": "Shoulders",
    "primaryMuscle": "Anterior Deltoids",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Hold single dumbbell with both hands.",
      "Raise forward."
    ],
    "commonMistakes": [
      "Elbow bending"
    ],
    "image": "/exercises/two-handed-dumbbell-front-raise.png"
  },
  {
    "id": "standing-behind-neck-barbell-press",
    "name": "Standing Behind The Neck Barbell Shoulder Press",
    "category": "Shoulders",
    "primaryMuscle": "Lateral Deltoids",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "instructions": [
      "Stand with barbell behind head.",
      "Press overhead."
    ],
    "commonMistakes": [
      "Poor neck posture"
    ],
    "image": "/exercises/standing-behind-neck-barbell-press.png"
  },
  {
    "id": "one-arm-low-pulley-front-raise-neutral",
    "name": "One-Arm Low-Pulley Front Raise Neutral Grip",
    "category": "Shoulders",
    "primaryMuscle": "Anterior Deltoids",
    "secondaryMuscles": [],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "instructions": [
      "Hold cable attachment in neutral grip.",
      "Raise forward to chin level."
    ],
    "commonMistakes": [
      "Bending elbow"
    ],
    "image": "/exercises/one-arm-low-pulley-front-raise-neutral.png"
  },
  {
    "id": "seated-behind-neck-barbell-press",
    "name": "Seated Behind The Neck Barbell Shoulder Press",
    "category": "Shoulders",
    "primaryMuscle": "Lateral Deltoids",
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "instructions": [
      "Sit holding barbell behind neck.",
      "Press bar overhead.",
      "Lower to base of neck with caution."
    ],
    "commonMistakes": [
      "Over-straining shoulders",
      "Bar hitting head"
    ],
    "image": "/exercises/seated-behind-neck-barbell-press.png"
  },
  {
    "id": "dumbbell-bent-over-row-single-arm",
    "name": "Dumbbell Bent-Over Row (Single Arm)",
    "category": "Back",
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids",
      "Rear Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Place one knee and hand on flat bench.",
      "Hold dumbbell in other hand, hanging straight down.",
      "Pull dumbbell up to rib cage, keeping elbow tight to body.",
      "Lower slowly to start."
    ],
    "commonMistakes": [
      "Rounding back",
      "Jerking weight up"
    ],
    "image": "/exercises/dumbbell-bent-over-row-single-arm.png"
  },
  {
    "id": "seated-cable-row",
    "name": "Seated Cable Row",
    "category": "Back",
    "primaryMuscle": "Rhomboids & Lats",
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "instructions": [
      "Sit holding attachment with feet on pads.",
      "Pull handle to lower abdomen, squeezing shoulder blades.",
      "Extend arms back out."
    ],
    "commonMistakes": [
      "Rounding spine",
      "Rocking torso back and forth"
    ],
    "image": "/exercises/seated-cable-row.png"
  },
  {
    "id": "close-grip-pulldown",
    "name": "Close-Grip Pulldown",
    "category": "Back",
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "instructions": [
      "Use V-bar attachment.",
      "Pull down to mid-chest.",
      "Extend arms fully."
    ],
    "commonMistakes": [
      "Using too much momentum"
    ],
    "image": "/exercises/close-grip-pulldown.png"
  },
  {
    "id": "wide-grip-pulldown",
    "name": "Wide-Grip Pulldown",
    "category": "Back",
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Biceps",
      "Upper Back"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "instructions": [
      "Sit at pulldown station and grip bar wide.",
      "Pull bar down to upper chest.",
      "Control the return."
    ],
    "commonMistakes": [
      "Pulling bar behind neck (creates neck strain)",
      "Leaning back too far"
    ],
    "image": "/exercises/wide-grip-pulldown.png"
  },
  {
    "id": "behind-neck-pulldown",
    "name": "Behind-Neck Pulldown",
    "category": "Back",
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Rhomboids"
    ],
    "equipment": "Cables",
    "difficulty": "Advanced",
    "instructions": [
      "Sit and pull bar down behind neck to base of skull."
    ],
    "commonMistakes": [
      "Shoulder impingement",
      "Hitting spine"
    ],
    "image": "/exercises/behind-neck-pulldown.png"
  },
  {
    "id": "barbell-row",
    "name": "Barbell Row",
    "category": "Back",
    "primaryMuscle": "Upper Back & Lats",
    "secondaryMuscles": [
      "Biceps",
      "Erector Spinae"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Hinge at hips, back straight, holding barbell.",
      "Pull bar to lower chest.",
      "Lower bar to start."
    ],
    "commonMistakes": [
      "Spinal rounding",
      "Lifting torso up to meet bar"
    ],
    "image": "/exercises/barbell-row.png"
  },
  {
    "id": "behind-neck-pull-up",
    "name": "Behind the Neck Pull Up",
    "category": "Back",
    "primaryMuscle": "Upper Back",
    "secondaryMuscles": [
      "Rear Delts"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "instructions": [
      "Pull body up ending with bar behind head."
    ],
    "commonMistakes": [
      "Neck strain"
    ],
    "image": "/exercises/behind-neck-pull-up.png"
  },
  {
    "id": "barbell-bent-over-rows-supinated",
    "name": "Barbell Bent Over Rows Supinated Grip",
    "category": "Back",
    "primaryMuscle": "Lats & Lower Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Hold bar underhand.",
      "Row to belly button."
    ],
    "commonMistakes": [
      "Rounding back"
    ],
    "image": "/exercises/barbell-bent-over-rows-supinated.png"
  },
  {
    "id": "rope-pulldown",
    "name": "Rope Pulldown",
    "category": "Back",
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "instructions": [
      "Pull rope from high pulley to thighs while standing."
    ],
    "commonMistakes": [
      "Bending elbows"
    ],
    "image": "/exercises/rope-pulldown.png"
  },
  {
    "id": "pull-up",
    "name": "Pull Up",
    "category": "Back",
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Biceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "Hang from bar overhand grip.",
      "Pull body up until chin clears bar.",
      "Lower slowly."
    ],
    "commonMistakes": [
      "Kipping or swinging",
      "Incomplete range"
    ],
    "image": "/exercises/pull-up.png"
  },
  {
    "id": "t-bar-rows",
    "name": "T-Bar Rows",
    "category": "Back",
    "primaryMuscle": "Middle Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Straddle landmine bar holding handles.",
      "Pull bar to chest, lower back flat."
    ],
    "commonMistakes": [
      "Bending spine"
    ],
    "image": "/exercises/t-bar-rows.png"
  },
  {
    "id": "reverse-grip-pulldown",
    "name": "Reverse-Grip Pulldown",
    "category": "Back",
    "primaryMuscle": "Lower Latissimus Dorsi",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "instructions": [
      "Sit and grip bar with underhand grip shoulder-width.",
      "Pull to upper chest."
    ],
    "commonMistakes": [
      "Using biceps too much"
    ],
    "image": "/exercises/reverse-grip-pulldown.png"
  },
  {
    "id": "pull-up-supinated",
    "name": "Pull Up with a Supinated Grip",
    "category": "Back",
    "primaryMuscle": "Lats",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "Hang underhand (chin-up style).",
      "Pull chin over bar."
    ],
    "commonMistakes": [
      "Using only arms"
    ],
    "image": "/exercises/pull-up-supinated.png"
  },
  {
    "id": "straight-arm-lat-pulldown",
    "name": "Straight Arm Lat Pulldown",
    "category": "Back",
    "primaryMuscle": "Lats",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "instructions": [
      "Pull straight bar down to thighs keeping arms extended."
    ],
    "commonMistakes": [
      "Bending elbows"
    ],
    "image": "/exercises/straight-arm-lat-pulldown.png"
  },
  {
    "id": "barbell-deadlift",
    "name": "Barbell Deadlift",
    "category": "Back",
    "primaryMuscle": "Erector Spinae & Glutes",
    "secondaryMuscles": [
      "Hamstrings",
      "Traps",
      "Core"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "instructions": [
      "Stand feet hip-width, barbell over mid-foot.",
      "Hinge down, grab bar, flatten back.",
      "Stand up driving hips forward, keeping bar close."
    ],
    "commonMistakes": [
      "Spinal flexion (curved back)",
      "Shrugging at top"
    ],
    "image": "/exercises/barbell-deadlift.png"
  },
  {
    "id": "dumbbell-bent-over-rows",
    "name": "Dumbbell Bent Over Rows",
    "category": "Back",
    "primaryMuscle": "Lats & Rhomboids",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Hinge forward holding two dumbbells.",
      "Row to waist."
    ],
    "commonMistakes": [
      "Rounding spine"
    ],
    "image": "/exercises/dumbbell-bent-over-rows.png"
  },
  {
    "id": "barbell-pullover",
    "name": "Barbell Pullover",
    "category": "Back",
    "primaryMuscle": "Lats & Chest",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Perform pullover with barbell."
    ],
    "commonMistakes": [
      "Uncontrolled drops"
    ],
    "image": "/exercises/barbell-pullover.png"
  },
  {
    "id": "dumbbell-pullover",
    "name": "Dumbbell Pullover",
    "category": "Back",
    "primaryMuscle": "Lats & Chest",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Lie perpendicular on bench, shoulder blades supported.",
      "Lower dumbbell overhead, stretch lats, pull back up."
    ],
    "commonMistakes": [
      "Bending elbows too much"
    ],
    "image": "/exercises/dumbbell-pullover.png"
  },
  {
    "id": "trap-bar-deadlift",
    "name": "Trap Bar Deadlift",
    "category": "Back",
    "primaryMuscle": "Quads & Glutes",
    "secondaryMuscles": [
      "Lower Back",
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Step inside hex bar, grab handles, hinge down.",
      "Drive floor away to stand."
    ],
    "commonMistakes": [
      "Squatting the weight instead of hinging"
    ],
    "image": "/exercises/trap-bar-deadlift.png"
  },
  {
    "id": "barbell-sumo-deadlift",
    "name": "Barbell Sumo Deadlift",
    "category": "Back",
    "primaryMuscle": "Glutes & Adductors",
    "secondaryMuscles": [
      "Lower Back",
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "instructions": [
      "Wide stance, grip inside knees.",
      "Pull bar straight up."
    ],
    "commonMistakes": [
      "Knees collapsing inward"
    ],
    "image": "/exercises/barbell-sumo-deadlift.png"
  },
  {
    "id": "dumbbell-deadlift",
    "name": "Dumbbell Deadlift",
    "category": "Back",
    "primaryMuscle": "Hamstrings & Glutes",
    "secondaryMuscles": [
      "Lower Back"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Perform deadlift holding dumbbells."
    ],
    "commonMistakes": [
      "Rounding back"
    ],
    "image": "/exercises/dumbbell-deadlift.png"
  },
  {
    "id": "squat",
    "name": "Squat",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Rest barbell on upper back.",
      "Hinge hips and bend knees to lower body down.",
      "Drive back up through heels."
    ],
    "commonMistakes": [
      "Knees caving inward",
      "Heels lifting off ground"
    ],
    "image": "/exercises/squat.png"
  },
  {
    "id": "leg-press",
    "name": "Leg Press",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "instructions": [
      "Place feet shoulder-width on sled.",
      "Lower sled until knees are at 90 degrees.",
      "Press sled back up without locking knees."
    ],
    "commonMistakes": [
      "Locking knees fully",
      "Lifting tailbone off seat"
    ],
    "image": "/exercises/leg-press.png"
  },
  {
    "id": "lunge",
    "name": "Lunge",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Step forward with one leg.",
      "Lower hips until back knee is near floor.",
      "Push back to start."
    ],
    "commonMistakes": [
      "Leaning too far forward",
      "Front knee sliding too far forward"
    ],
    "image": "/exercises/lunge.png"
  },
  {
    "id": "lying-leg-curl",
    "name": "Lying Leg Curl",
    "category": "Legs",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "instructions": [
      "Lie face down, pad on back of ankles.",
      "Curl heels to glutes.",
      "Lower slowly."
    ],
    "commonMistakes": [
      "Lifting hips off pad"
    ],
    "image": "/exercises/lying-leg-curl.png"
  },
  {
    "id": "hack-squat",
    "name": "Hack Squat",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Machine",
    "difficulty": "Intermediate",
    "instructions": [
      "Place back against pad, feet shoulder-width.",
      "Lower down and press up."
    ],
    "commonMistakes": [
      "Shallow depth"
    ],
    "image": "/exercises/hack-squat.png"
  },
  {
    "id": "seated-leg-curl",
    "name": "Seated Leg Curl",
    "category": "Legs",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "instructions": [
      "Sit in machine, pull legs down towards seat."
    ],
    "commonMistakes": [
      "Thigh pad loose"
    ],
    "image": "/exercises/seated-leg-curl.png"
  },
  {
    "id": "leg-extension",
    "name": "Leg Extension",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "instructions": [
      "Sit in machine, pad on lower shins.",
      "Extend legs forward and squeeze quads.",
      "Lower slowly."
    ],
    "commonMistakes": [
      "Swinging weight plates",
      "Incorrect pad position"
    ],
    "image": "/exercises/leg-extension.png"
  },
  {
    "id": "single-leg-extension",
    "name": "Single Leg Extension",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "difficulty": "Intermediate",
    "instructions": [
      "Perform leg extension using one leg."
    ],
    "commonMistakes": [
      "Twisting hips"
    ],
    "image": "/exercises/single-leg-extension.png"
  },
  {
    "id": "barbell-stiff-leg-deadlift",
    "name": "Barbell Stiff-Leg Deadlift",
    "category": "Legs",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes",
      "Lower Back"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Hinge at hips holding barbell, slight knee bend, push hips back."
    ],
    "commonMistakes": [
      "Rounding lower back"
    ],
    "image": "/exercises/barbell-stiff-leg-deadlift.png"
  },
  {
    "id": "dumbbell-goblet-squat",
    "name": "Dumbbell Goblet Squat",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Hold dumbbell vertically at chest.",
      "Squat down and push floor away."
    ],
    "commonMistakes": [
      "Rounding back"
    ],
    "image": "/exercises/dumbbell-goblet-squat.png"
  },
  {
    "id": "dumbbell-stiff-leg-deadlift",
    "name": "Dumbbell Stiff-Leg Deadlift",
    "category": "Legs",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes",
      "Lower Back"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "instructions": [
      "Hold dumbbells in front of thighs.",
      "Hinge hips back, keeping legs mostly straight."
    ],
    "commonMistakes": [
      "Bending knees too much"
    ],
    "image": "/exercises/dumbbell-stiff-leg-deadlift.png"
  },
  {
    "id": "front-squat",
    "name": "Front Squat",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Core",
      "Glutes"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "instructions": [
      "Hold bar in front rack position.",
      "Squat deep while keeping elbows high."
    ],
    "commonMistakes": [
      "Dropping elbows",
      "Torso falling forward"
    ],
    "image": "/exercises/front-squat.png"
  },
  {
    "id": "knee-tuck-jumps",
    "name": "Knee Tuck Jumps",
    "category": "Legs",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Calves",
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "Jump up and tuck knees to chest."
    ],
    "commonMistakes": [
      "Hard landings"
    ],
    "image": "/exercises/knee-tuck-jumps.png"
  },
  {
    "id": "one-point-five-rep-squat",
    "name": "1.5 Rep Bodyweight Squats",
    "category": "Legs",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "Squat all the way down, rise halfway, go back down, then stand."
    ],
    "commonMistakes": [
      "Rushing the reps"
    ],
    "image": "/exercises/one-point-five-rep-squat.png"
  },
  {
    "id": "barbell-bulgarian-split-squat",
    "name": "Barbell Bulgarian Split Squat",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "instructions": [
      "Rest back foot on bench, hold barbell on back, lower down."
    ],
    "commonMistakes": [
      "Losing balance",
      "Front knee caving"
    ],
    "image": "/exercises/barbell-bulgarian-split-squat.png"
  },
  {
    "id": "bodyweight-squat",
    "name": "Bodyweight Squat",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "Squat without weights."
    ],
    "commonMistakes": [
      "Shallow depth"
    ],
    "image": "/exercises/bodyweight-squat.png"
  },
  {
    "id": "bodyweight-bulgarian-split-squat",
    "name": "Bodyweight Bulgarian Split Squat",
    "category": "Legs",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "One foot on bench, squat down."
    ],
    "commonMistakes": [
      "Stance too close"
    ],
    "image": "/exercises/bodyweight-bulgarian-split-squat.png"
  },
  {
    "id": "medicine-ball-squat",
    "name": "Medicine Ball Squat",
    "category": "Legs",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Other",
    "difficulty": "Beginner",
    "instructions": [
      "Hold medicine ball and squat."
    ],
    "commonMistakes": [
      "Curving upper back"
    ],
    "image": "/exercises/medicine-ball-squat.png"
  },
  {
    "id": "burpees",
    "name": "Burpees",
    "category": "Legs",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Chest",
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "Drop to pushup position, jump back up, jump vertically."
    ],
    "commonMistakes": [
      "Losing core tension"
    ],
    "image": "/exercises/burpees.png"
  },
  {
    "id": "jump-squat",
    "name": "Jump Squat",
    "category": "Legs",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Calves"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "Squat down and explode upwards into a jump."
    ],
    "commonMistakes": [
      "Stiff knee landing"
    ],
    "image": "/exercises/jump-squat.png"
  },
  {
    "id": "mini-band-air-squat",
    "name": "Mini-Band Air Squat",
    "category": "Legs",
    "primaryMuscle": "Gluteus Medius",
    "secondaryMuscles": [
      "Quads"
    ],
    "equipment": "Other",
    "difficulty": "Beginner",
    "instructions": [
      "Put mini-band above knees and squat."
    ],
    "commonMistakes": [
      "Letting band pull knees together"
    ],
    "image": "/exercises/mini-band-air-squat.png"
  },
  {
    "id": "kettlebell-sumo-deadlift",
    "name": "Kettlebell Sumo Deadlift",
    "category": "Legs",
    "primaryMuscle": "Glutes & Hamstrings",
    "secondaryMuscles": [
      "Lower Back"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Wide stance, hold kettlebell, deadlift."
    ],
    "commonMistakes": [
      "Back rounding"
    ],
    "image": "/exercises/kettlebell-sumo-deadlift.png"
  },
  {
    "id": "wall-sit",
    "name": "Wall Sit",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "Press back against wall, lower hips until thighs parallel to floor."
    ],
    "commonMistakes": [
      "Thighs not parallel"
    ],
    "image": "/exercises/wall-sit.png"
  },
  {
    "id": "medicine-ball-deadlift",
    "name": "Medicine Ball Deadlift",
    "category": "Legs",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Other",
    "difficulty": "Beginner",
    "instructions": [
      "Perform hinge deadlift holding ball."
    ],
    "commonMistakes": [
      "Squatting the lift"
    ],
    "image": "/exercises/medicine-ball-deadlift.png"
  },
  {
    "id": "single-leg-bodyweight-deadlift",
    "name": "Single Leg Bodyweight Deadlift",
    "category": "Legs",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Core",
      "Glutes"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "Balance on one leg, hinge forward lifting back leg."
    ],
    "commonMistakes": [
      "Losing balance",
      "Rounding spine"
    ],
    "image": "/exercises/single-leg-bodyweight-deadlift.png"
  },
  {
    "id": "single-leg-glute-bridge",
    "name": "Single Leg Glute Bridge",
    "category": "Legs",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "Glute bridge with one leg extended."
    ],
    "commonMistakes": [
      "Hips tilting"
    ],
    "image": "/exercises/single-leg-glute-bridge.png"
  },
  {
    "id": "duck-walk",
    "name": "Duck Walk",
    "category": "Legs",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "Walk in a deep squat position."
    ],
    "commonMistakes": [
      "Heels off floor"
    ],
    "image": "/exercises/duck-walk.png"
  },
  {
    "id": "bodyweight-glute-bridge",
    "name": "Bodyweight Glute Bridge",
    "category": "Legs",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "Lie on back, knees bent, lift hips up."
    ],
    "commonMistakes": [
      "Arching lower back instead of squeezing glutes"
    ],
    "image": "/exercises/bodyweight-glute-bridge.png"
  },
  {
    "id": "banded-glute-bridge",
    "name": "Banded Glute Bridge",
    "category": "Legs",
    "primaryMuscle": "Gluteus Medius",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Other",
    "difficulty": "Beginner",
    "instructions": [
      "Glute bridge with band above knees."
    ],
    "commonMistakes": [
      "Knees caving"
    ],
    "image": "/exercises/banded-glute-bridge.png"
  },
  {
    "id": "good-morning",
    "name": "Good Morning",
    "category": "Legs",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Lower Back",
      "Glutes"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "instructions": [
      "Barbell on shoulders, hinge forward keeping spine flat."
    ],
    "commonMistakes": [
      "Rounding lower back"
    ],
    "image": "/exercises/good-morning.png"
  },
  {
    "id": "seated-hip-abduction-machine",
    "name": "Seated Hip Abduction Machine",
    "category": "Legs",
    "primaryMuscle": "Gluteus Medius",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "instructions": [
      "Push pads outward against weight."
    ],
    "commonMistakes": [
      "Lifting off seat"
    ],
    "image": "/exercises/seated-hip-abduction-machine.png"
  },
  {
    "id": "band-seated-hip-abduction",
    "name": "Band Seated Hip Abduction",
    "category": "Legs",
    "primaryMuscle": "Gluteus Medius",
    "secondaryMuscles": [],
    "equipment": "Other",
    "difficulty": "Beginner",
    "instructions": [
      "Sit, press knees outward against band."
    ],
    "commonMistakes": [
      "Slouching"
    ],
    "image": "/exercises/band-seated-hip-abduction.png"
  },
  {
    "id": "barbell-hip-thrust",
    "name": "Barbell Hip Thrust",
    "category": "Legs",
    "primaryMuscle": "Gluteus Maximus",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "instructions": [
      "Thrust up with barbell across hips."
    ],
    "commonMistakes": [
      "Hyper-extending lower back"
    ],
    "image": "/exercises/barbell-hip-thrust.png"
  },
  {
    "id": "smith-machine-hip-thrust",
    "name": "Smith Machine Hip Thrust",
    "category": "Legs",
    "primaryMuscle": "Gluteus Maximus",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Machine",
    "difficulty": "Intermediate",
    "instructions": [
      "Shoulders on bench, feet on floor, smith bar across hips, thrust up."
    ],
    "commonMistakes": [
      "Over-arching lumbar spine"
    ],
    "image": "/exercises/smith-machine-hip-thrust.png"
  },
  {
    "id": "fire-hydrants",
    "name": "Fire Hydrants",
    "category": "Legs",
    "primaryMuscle": "Gluteus Medius",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "All fours, lift knee out to side."
    ],
    "commonMistakes": [
      "Leaning torso to side"
    ],
    "image": "/exercises/fire-hydrants.png"
  },
  {
    "id": "groiners",
    "name": "Groiners",
    "category": "Legs",
    "primaryMuscle": "Hip Flexors",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "Plank position, jump feet to outside of hands."
    ],
    "commonMistakes": [
      "Hips sagged"
    ],
    "image": "/exercises/groiners.png"
  },
  {
    "id": "side-lying-leg-raise",
    "name": "Side Lying Leg Raise",
    "category": "Legs",
    "primaryMuscle": "Gluteus Medius",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "Lie on side, raise top leg straight up."
    ],
    "commonMistakes": [
      "Toes pointing up (should point slightly down/forward)"
    ],
    "image": "/exercises/side-lying-leg-raise.png"
  },
  {
    "id": "glute-ham-raise",
    "name": "Glute Ham Raise",
    "category": "Legs",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes",
      "Lower Back"
    ],
    "equipment": "Other",
    "difficulty": "Advanced",
    "instructions": [
      "Position on GHD machine, lower torso forward, curl body back up."
    ],
    "commonMistakes": [
      "Bending at hips instead of knees"
    ],
    "image": "/exercises/glute-ham-raise.png"
  },
  {
    "id": "standing-cable-abduction",
    "name": "Standing Cable Abduction",
    "category": "Legs",
    "primaryMuscle": "Gluteus Medius",
    "secondaryMuscles": [],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "instructions": [
      "Kick leg out to side against low cable."
    ],
    "commonMistakes": [
      "Leaning torso"
    ],
    "image": "/exercises/standing-cable-abduction.png"
  },
  {
    "id": "smith-machine-frog-pump",
    "name": "Smith Machine Frog Pump",
    "category": "Legs",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "difficulty": "Advanced",
    "instructions": [
      "Frog pump with Smith machine bar."
    ],
    "commonMistakes": [
      "Uncontrolled path"
    ],
    "image": "/exercises/smith-machine-frog-pump.png"
  },
  {
    "id": "bodyweight-frog-pump",
    "name": "Bodyweight Frog Pump",
    "category": "Legs",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "Lie on back, soles of feet together, lift hips."
    ],
    "commonMistakes": [
      "Short range"
    ],
    "image": "/exercises/bodyweight-frog-pump.png"
  },
  {
    "id": "banded-clams",
    "name": "Banded Clams",
    "category": "Legs",
    "primaryMuscle": "Gluteus Medius",
    "secondaryMuscles": [],
    "equipment": "Other",
    "difficulty": "Beginner",
    "instructions": [
      "Lie on side, knees bent with band, open top knee."
    ],
    "commonMistakes": [
      "Rolling hips back"
    ],
    "image": "/exercises/banded-clams.png"
  },
  {
    "id": "dumbbell-step-up",
    "name": "Dumbbell Step Up",
    "category": "Legs",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Step up onto box with dumbbells."
    ],
    "commonMistakes": [
      "Pushing off back foot too much"
    ],
    "image": "/exercises/dumbbell-step-up.png"
  },
  {
    "id": "lateral-mini-band-walk",
    "name": "Lateral Mini-Band Walk",
    "category": "Legs",
    "primaryMuscle": "Gluteus Medius",
    "secondaryMuscles": [],
    "equipment": "Other",
    "difficulty": "Beginner",
    "instructions": [
      "Walk sideways with band above knees or ankles."
    ],
    "commonMistakes": [
      "Dragging feet"
    ],
    "image": "/exercises/lateral-mini-band-walk.png"
  },
  {
    "id": "standing-knee-raise",
    "name": "Standing Knee Raise",
    "category": "Legs",
    "primaryMuscle": "Hip Flexors",
    "secondaryMuscles": [
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "Stand and raise knee to chest."
    ],
    "commonMistakes": [
      "Slouching"
    ],
    "image": "/exercises/standing-knee-raise.png"
  },
  {
    "id": "donkey-kicks",
    "name": "Donkey Kicks",
    "category": "Legs",
    "primaryMuscle": "Gluteus Maximus",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "All fours, kick one heel up towards ceiling."
    ],
    "commonMistakes": [
      "Arching lower back"
    ],
    "image": "/exercises/donkey-kicks.png"
  },
  {
    "id": "standing-cable-kickback",
    "name": "Standing Cable Kickback",
    "category": "Legs",
    "primaryMuscle": "Gluteus Maximus",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "instructions": [
      "Attach ankle cuff to low cable, kick leg backward."
    ],
    "commonMistakes": [
      "Arching lower back"
    ],
    "image": "/exercises/standing-cable-kickback.png"
  },
  {
    "id": "side-lying-hip-raise",
    "name": "Side Lying Hip Raise",
    "category": "Legs",
    "primaryMuscle": "Obliques & Gluteus Medius",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "instructions": [
      "Side plank from knees, lift top leg."
    ],
    "commonMistakes": [
      "Sagging hips"
    ],
    "image": "/exercises/side-lying-hip-raise.png"
  },
  {
    "id": "squat-sit-to-reach",
    "name": "Squat Sit to Reach",
    "category": "Legs",
    "primaryMuscle": "Mobility & Glutes",
    "secondaryMuscles": [
      "Upper Back"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "instructions": [
      "Squat deep, hold toes, rotate one arm up to ceiling."
    ],
    "commonMistakes": [
      "Lifting heels"
    ],
    "image": "/exercises/squat-sit-to-reach.png"
  },
  {
    "id": "dumbbell-shrug",
    "name": "Dumbbell Shrug",
    "category": "Shoulders",
    "primaryMuscle": "Trapezius",
    "secondaryMuscles": [
      "Upper Back"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "instructions": [
      "Stand straight holding dumbbells at your sides with a neutral grip.",
      "Keep your arms straight and shrug your shoulders as high as possible.",
      "Hold the contraction at the top for a second, then lower slowly."
    ],
    "commonMistakes": [
      "Rolling the shoulders in a circle",
      "Using the biceps to pull the weight"
    ],
    "image": "/exercises/dumbbell-shrugs.png"
  },
  {
    "id": "barbell-shrug",
    "name": "Barbell Shrug",
    "category": "Shoulders",
    "primaryMuscle": "Trapezius",
    "secondaryMuscles": [
      "Upper Back"
    ],
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "instructions": [
      "Stand straight holding a barbell in front of your thighs with an overhand grip.",
      "Keep your arms straight and shrug your shoulders straight up toward your ears.",
      "Squeeze at the top, then lower with control."
    ],
    "commonMistakes": [
      "Rolling the shoulders",
      "Bending the elbows"
    ],
    "image": "/exercises/barbell-shrug.png"
  },
  {
    "id": "machine-shrug",
    "name": "Machine Shrug",
    "category": "Shoulders",
    "primaryMuscle": "Trapezius",
    "secondaryMuscles": [
      "Upper Back"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "instructions": [
      "Stand on the machine platform and grip the handles on either side.",
      "Keep your arms straight and lift your shoulders up toward your ears as high as possible.",
      "Squeeze your traps at the peak of the movement, then slowly lower to the starting position."
    ],
    "commonMistakes": [
      "Rolling the shoulders in circles",
      "Using too much weight causing neck strain"
    ],
    "image": "/exercises/machine-shrug.png"
  }
];

/**
 * Maps raw anatomical muscle names from the database to clean, gym-friendly names.
 */
export const toGymMuscleName = (muscle: string): string => {
  const m = muscle.trim();
  
  // Chest
  if (m === 'Upper Pectoralis') return 'Upper Chest';
  if (m === 'Lower Pectoralis') return 'Lower Chest';
  if (m === 'Pectoralis Major') return 'Middle Chest';
  
  // Shoulders
  if (m === 'Anterior Deltoids') return 'Front Delts';
  if (m === 'Lateral Deltoids') return 'Side Delts';
  if (m === 'Posterior Deltoids') return 'Rear Delts';
  if (m === 'Trapezius') return 'Traps';
  
  // Biceps & Forearms
  if (
    m === 'Biceps Brachii' ||
    m === 'Biceps Brachii (Long Head)' ||
    m === 'Biceps Brachii (Short Head)' ||
    m === 'Brachialis'
  ) {
    return 'Biceps';
  }
  if (m === 'Brachioradialis') return 'Forearms';
  
  // Triceps
  if (m === 'Triceps') return 'Triceps';
  
  // Back
  if (
    m === 'Latissimus Dorsi' ||
    m === 'Lats' ||
    m === 'Lower Latissimus Dorsi' ||
    m === 'Lats & Lower Back' ||
    m === 'Lats & Rhomboids' ||
    m === 'Lats & Chest'
  ) {
    return 'Lats';
  }
  if (
    m === 'Upper Back' ||
    m === 'Upper Back & Lats' ||
    m === 'Rhomboids & Lats' ||
    m === 'Middle Back'
  ) {
    return 'Upper Back';
  }
  if (
    m === 'Erector Spinae & Glutes' ||
    m === 'Lower Back' ||
    m === 'Erector Spinae' ||
    m === 'Quads & Glutes' ||
    m === 'Glutes & Adductors' ||
    m === 'Hamstrings & Glutes' && !['Legs'].includes(m) // handle specifically for Back category
  ) {
    return 'Lower Back';
  }
  
  // Legs
  if (m === 'Quadriceps' || m === 'Quads' || m === 'Full Body' || m === 'Hip Flexors') {
    return 'Quads';
  }
  if (m === 'Hamstrings' || m === 'Glutes & Hamstrings' || m === 'Hamstrings & Glutes') {
    return 'Hamstrings';
  }
  if (
    m === 'Glutes' ||
    m === 'Gluteus Maximus' ||
    m === 'Gluteus Medius' ||
    m === 'Mobility & Glutes' ||
    m === 'Obliques & Gluteus Medius'
  ) {
    return 'Glutes';
  }
  if (m === 'Calves') return 'Calves';
  if (m === 'Adductors') return 'Inner Thighs';

  return m;
};

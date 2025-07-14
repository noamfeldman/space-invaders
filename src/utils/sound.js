const playSound = (soundFile) => {
  const audio = new Audio(soundFile);
  audio.play().catch(error => {
    // Autoplay was prevented. This is common in browsers.
    // We can console.log this for debugging, but shouldn't disrupt the user.
    console.log(`Could not play sound ${soundFile}: ${error}`);
  });
};

export default playSound; 
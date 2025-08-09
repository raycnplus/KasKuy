// Wait for the document to be ready
document.addEventListener('DOMContentLoaded', () => {

  // Select all the elements we need to animate
  const icons = gsap.utils.toArray(".icon");
  const initialScreen = document.querySelector(".initial-screen");
  const finalScreen = document.querySelector(".final-screen");

  // This function will be called when we want to start the animation
  function playTransition() {
    // 1. Get the current state of the icons
    const state = Flip.getState(icons);

    // 2. Move the icons to their new "home" inside the final text
    // We match them one-by-one to their placeholders
    document.getElementById("placeholder-music").appendChild(document.getElementById("icon-music"));
    document.getElementById("placeholder-movie").appendChild(document.getElementById("icon-movie"));
    document.getElementById("placeholder-game").appendChild(document.getElementById("icon-game"));
    document.getElementById("placeholder-shop").appendChild(document.getElementById("icon-shop"));
    document.getElementById("placeholder-shirt").appendChild(document.getElementById("icon-shirt"));

    // 3. Create the animation timeline
    const tl = gsap.timeline();

    // Animate the initial text out
    tl.to(initialScreen.querySelector("h1"), {
      opacity: 0,
      duration: 0.5,
      y: -50 // Move it up as it fades
    });

    // Use Flip.from() to animate the icons from their OLD state to the NEW state
    // This is the core of the magic trick!
    tl.from(state, {
      duration: 1.5,
      scale: true, // Animate scale
      ease: "power4.inOut", // A nice, smooth easing function
      stagger: 0.05 // Slightly delay each icon for a cooler effect
    });

    // Animate the final text in
    tl.to(finalScreen, {
      opacity: 1,
      duration: 1
    }, "-=1"); // Overlap this animation with the previous one
  }

  // Optional: Start the animation after a short delay
  setTimeout(playTransition, 1000);
});

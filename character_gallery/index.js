function playerPath(){
  return `score.${window.scoreboardNumber}.team.${window.team}.player.${window.player}`
}

LoadEverything().then(() => {
  Start = async () => {};

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

    let src = "";

    if (window.team != undefined && window.player != undefined) {
      src = playerPath();
    } else {
      src = `score.${window.scoreboardNumber}.team.${window.team}`;
    }

    CharacterDisplay(
      $(`.container`),
      {
        source: src,
        anim_out: {
          autoAlpha: 0,
          duration: 0
        },
        anim_in: {
          autoAlpha: 0,
          duration: 0
        }
      },
      event
    ).then(() => {
      imgs = $.makeArray($(".tsh_character"));

      // Set all imgs opacity to 0
      for (let img of imgs) {
        $(img).css("opacity", 0);
      }

      // Show only the first character initially, using gsap to override animations
      gsap.set(imgs, { autoAlpha: 0 });
      gsap.set(imgs[0], { autoAlpha: 1 });

      if (imgs.length < 2) {
        $(".index_display").css({ opacity: 0 });
      } else {
        gsap.set($(".index_display"), { autoAlpha: 1 });
      }

      crossfade(); // Start the crossfade immediately after loading the characters
    });
  };

  let cycleIndex = 0;
  let imgs = [];
  let firstUpdate = true;

  function crossfade() {
    if (imgs.length > 1) {
      gsap.to(imgs[(cycleIndex + imgs.length - 1) % imgs.length], 1, {
        autoAlpha: 0,
        duration: firstUpdate ? 0 : 1, // Skip fade out on the first update
      });
      gsap.to(imgs[cycleIndex], 1, {
        autoAlpha: 1,
        duration: firstUpdate ? 0 : 1, // Skip fade in on the first update
      });
      firstUpdate = false;
      
      $(".index_display").html(`${cycleIndex + 1}/${imgs.length}`);
      cycleIndex = (cycleIndex + 1) % imgs.length;
    } else if (imgs.length == 1) {
      gsap.to(
        imgs[0], 1, {
          autoAlpha: 1,
          duration: firstUpdate ? 0 : 1, // Skip fade in on the first update
        });
      firstUpdate = false;

      $(".index_display").html(`1/1`);
      cycleIndex = 0;
    }

  }

  var cycle = setInterval(crossfade, 3000);
});

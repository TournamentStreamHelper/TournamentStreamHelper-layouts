function playerPath(){
  return `score.${window.scoreboardNumber}.team.${window.team}.player.${window.player}`
}

LoadEverything().then(() => {
  Start = async () => {
    $(".tsh_character > div").each((i, e) => $(e).css("opacity", "0"));
    $(".variant_display > div").each((i, e) => $(e).css("opacity", "0"));
  };

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

    let src = "";

    if (window.team != undefined && window.player != undefined) {
      src = playerPath();
    } else {
      src = `score.${window.scoreboardNumber}.team.${window.team}`;
    }

    await CharacterDisplay(
      $(`.container`),
      {
        source: src,
      },
      event
    );

    let variant_html = ""
    let player = _.get(data, playerPath());
    if (player && player.character){
      for (let c of Object.values(player.character)){
        if (c.variant && c.variant.icon_path){
          variant_html += `<div class = "variant" style = 'background-image: url("../../${c.variant.icon_path}");'></div>` 
        } else {
          variant_html += "<div></div>"
        }
      }
      console.log("VARIEATETET OOOOOOO")
      $(".variant_display").html(variant_html);
    }

    imgs = $.makeArray($(".tsh_character > div"));
    variant_imgs = $.makeArray($(".variant_display > div"))

    if (imgs.length < 2) {
      gsap.to($(".index_display"), { autoAlpha: 0 });
    } else {
      gsap.to($(".index_display"), { autoAlpha: 1 });
    }
  };

  let cycleIndex = 0;
  let imgs = [];
  let variant_imgs = [];

  function crossfade() {
    if (imgs.length > 1) {
      gsap.to(imgs[(cycleIndex + imgs.length - 1) % imgs.length], 1, {
        autoAlpha: 0,
      });
      gsap.to(imgs[cycleIndex], 1, { autoAlpha: 1 });

      gsap.to(variant_imgs[(cycleIndex + imgs.length - 1) % imgs.length], 1, {
        autoAlpha: 0,
      });
      gsap.to(variant_imgs[cycleIndex], 1, { autoAlpha: 1 });

      $(".index_display").html(`${cycleIndex + 1}/${imgs.length}`);
      cycleIndex = (cycleIndex + 1) % imgs.length;
    } else if (imgs.length == 1) {
      gsap.to(imgs[0], 1, { autoAlpha: 1 });
      gsap.to(variant_imgs[0], 1, { autoAlpha: 1 })
      $(".index_display").html(`1/1`);
      cycleIndex = 0;
    }

  }

  var cycle = setInterval(crossfade, 3000);
});

LoadEverything().then(() => {
  
  let startingAnimation = gsap
    .timeline({ paused: true })
    .from($(".recent_sets"), { autoAlpha: 0 });

  var playersRecentSets = null;

  Start = async (event) => {
    startingAnimation.restart();
  };

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

    // Set team colors if available
    const teams = Object.values(data.score[window.scoreboardNumber].team);
    for (const [t, team] of teams.entries()) {
      if (team.color && !tsh_settings["forceDefaultScoreColors"]) {
        document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
      }
    }

    if (
      !oldData.score ||
      JSON.stringify(oldData.score[window.scoreboardNumber].recent_sets) !=
        JSON.stringify(data.score[window.scoreboardNumber].recent_sets)
    ) {
      playersRecentSets = data.score[window.scoreboardNumber].recent_sets;
      console.log(playersRecentSets);
    }

    recentSetsHtml = "";

    if (
      playersRecentSets == null ||
      (playersRecentSets.state == "done" && playersRecentSets.sets.length == 0)
    ) {
      recentSetsHtml = `No sets found`;
    } else if (playersRecentSets.state != "done") {
      recentSetsHtml += `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
    } else {
      playersRecentSets.sets.slice(0, 5).forEach((_set, i) => {
        recentSetsHtml += `
            <div class="set_container set_${i}">
              <div class="${_set.winner == 0 ? "set_winner" : "set_loser"}">
                ${_set.score[0]}
              </div>
              <div class="p1_char"></div>
              <div class="set_info">
                <div class="set_title">
                  ${_set.online ? `<div class="wifi_icon"></div>` : ""}
                  ${_set.tournament}
                </div>
                <div class="set_date">
                  ${new Date(_set.timestamp * 1000).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }
                  )}
                </div>
              </div>
              <div class="p2_char"></div>
              <div class="${_set.winner == 1 ? "set_winner" : "set_loser"}">
                ${_set.score[1]}
              </div>
            </div>
          `;
      });
      $(`.recent_sets_content`).html(recentSetsHtml);
      for (const [i] of playersRecentSets.sets.slice(0, 5).entries()) {
        await CharacterDisplay(
          $(`.set_${i} .p1_char`),
          {
            source: `score.${window.scoreboardNumber}.recent_sets.sets.${i}.p1_char`,
          },
          event
        );
        await CharacterDisplay(
          $(`.set_${i} .p2_char`),
          {
            source: `score.${window.scoreboardNumber}.recent_sets.sets.${i}.p2_char`,
          },
          event
        );
      }
    }
  };
});

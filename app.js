let left = document.getElementById("left");
let right = document.getElementById("right");

var leftNum = "01";
var rightNum = "07"; // we had a bug since didn't

left.addEventListener("click", function () {
  rightNum = getImage();
  right.setAttribute("src", `images/${rightNum}.jpg`);
});

right.addEventListener("click", function () {
  leftNum = getImage(); // we got the other pic to change
  left.setAttribute("src", `images/${leftNum}.jpg`);
});

function getImage() {
  let zero = "0";
  let number = Math.ceil(Math.random() * 10);
  if (number != 10) {
    // creating the file number by adding zero
    number = zero + number;
  }

  if (number != leftNum && number != rightNum) {
    // we need diff ppl by each click
    return number;
  } else if (number == leftNum || number == rightNum) {
    return getImage(); // if random num is already appearing on the screen, then create a new one.
  }
}

let totalImages = 15; // Adjust this number based on the actual number of images you have
let ratings = {};

for (let i = 1; i <= totalImages; i++) {
  let imageId = i.toString().padStart(2, "0"); // Ensures IDs like "01", "02",...
  ratings[imageId] = {
    rating: 1400,
    played: 0,
    src: `images/${imageId}.jpg`,
  };
}

// Adjust getImage to work with new rating system
function getImage(excludeIds) {
  let candidates = Object.keys(ratings).filter(
    (id) => !excludeIds.includes(id)
  );
  if (candidates.length === 0) return null; // Handle edge case
  let choiceIndex = Math.floor(Math.random() * candidates.length);
  return candidates[choiceIndex];
}

// Update ratings function
function updateRatings(winnerId, loserId) {
  const K = 32;
  let Ra = ratings[winnerId].rating;
  let Rb = ratings[loserId].rating;
  let Ea = 1 / (1 + 10 ** ((Rb - Ra) / 400));
  let Eb = 1 / (1 + 10 ** ((Ra - Rb) / 400));

  ratings[winnerId].rating += K * (1 - Ea);
  ratings[loserId].rating += K * (0 - Eb);

  updateLeaderboard();
}

function updateLeaderboard() {
  let sortedParticipants = Object.entries(ratings)
    .sort(([, a], [, b]) => b.rating - a.rating)
    .slice(0, 15); // Only take top 10

  let leaderboardHTML = sortedParticipants
    .map(([id, { rating, src }], index) => {
      return `<li>
                    <img src="${src}" alt="Participant ${id}" style="width: 50px; height: 50px; object-fit: cover;">
                    <span>${index + 1}. Rating: ${Math.round(rating)}</span>
                </li>`;
    })
    .join("");

  document.getElementById("leaderboard").innerHTML = leaderboardHTML;
}

// Initial call to display leaderboard
document.addEventListener("DOMContentLoaded", updateLeaderboard);

document.getElementById("left").addEventListener("click", function () {
  let prevWinnerId = left.getAttribute("data-id"); // Previous winner
  let excludeIds = [prevWinnerId, right.getAttribute("data-id")]; // Exclude current and opponent
  rightNum = getImage(excludeIds); // Get new opponent
  right.setAttribute("src", ratings[rightNum].src);
  right.setAttribute("data-id", rightNum);
  updateRatings(prevWinnerId, right.getAttribute("data-id"));
});

document.getElementById("right").addEventListener("click", function () {
  let prevWinnerId = right.getAttribute("data-id"); // Previous winner
  let excludeIds = [prevWinnerId, left.getAttribute("data-id")]; // Exclude current and opponent
  leftNum = getImage(excludeIds); // Get new opponent
  left.setAttribute("src", ratings[leftNum].src);
  left.setAttribute("data-id", leftNum);
  updateRatings(prevWinnerId, left.getAttribute("data-id"));
});

// Initial call to display leaderboard
updateLeaderboard();

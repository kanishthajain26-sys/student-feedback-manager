const API_URL = "http://localhost:5000/api/feedback";

const form = document.getElementById("feedbackForm");

const nameInput = document.getElementById("name");
const courseInput = document.getElementById("course");
const ratingInput = document.getElementById("rating");
const commentInput = document.getElementById("comment");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

const feedbackList = document.getElementById("feedbackList");
const message = document.getElementById("message");

const searchInput = document.getElementById("searchInput");
const ratingFilter = document.getElementById("ratingFilter");
const courseFilter = document.getElementById("courseFilter");

const refreshBtn = document.getElementById("refreshBtn");

const totalFeedback = document.getElementById("totalFeedback");
const averageRating = document.getElementById("averageRating");
const fiveStarCount = document.getElementById("fiveStarCount");

const ratingOverview = document.getElementById(
  "ratingOverview"
);

let allFeedbacks = [];

let editingId = null;

async function loadFeedbacks() {
  try {
    message.textContent = "Loading feedbacks...";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch feedbacks");
    }

    allFeedbacks = await response.json();

    updateDashboard();

    applyFilters();

    message.textContent = "";

  } catch (error) {
    console.log(error);

    message.textContent =
      "Unable to load feedbacks.";
  }
}

function updateDashboard() {

  const total = allFeedbacks.length;

  totalFeedback.textContent = total;


  if (total === 0) {

    averageRating.textContent = "0 ⭐";

    fiveStarCount.textContent = "0";

    ratingOverview.innerHTML =
      "<p>No ratings available.</p>";

    return;
  }


  const totalRating =
    allFeedbacks.reduce(
      (sum, feedback) =>
        sum + Number(feedback.rating),
      0
    );


  const average =
    totalRating / total;


  averageRating.textContent =
    `${average.toFixed(1)} ⭐`;


  const fiveStars =
    allFeedbacks.filter(
      (feedback) =>
        Number(feedback.rating) === 5
    ).length;


  fiveStarCount.textContent =
    fiveStars;


  showRatingOverview();
}


function showRatingOverview() {

  ratingOverview.innerHTML = "";


  for (
    let rating = 5;
    rating >= 1;
    rating--
  ) {

    const count =
      allFeedbacks.filter(
        (feedback) =>
          Number(feedback.rating) === rating
      ).length;


    const percentage =
      allFeedbacks.length === 0
        ? 0
        : (count / allFeedbacks.length) * 100;


    const row =
      document.createElement("div");


    row.className = "rating-row";


    row.innerHTML = `

      <span>${rating} ⭐</span>

      <div class="progress">

        <div
          class="progress-bar"
          style="width: ${percentage}%"
        ></div>

      </div>

      <span>${count}</span>

    `;


    ratingOverview.appendChild(row);
  }
}



function displayFeedbacks(feedbacks) {

  feedbackList.innerHTML = "";


  if (feedbacks.length === 0) {

    feedbackList.innerHTML =
      "<p>No feedback found.</p>";

    return;
  }


  feedbacks.forEach((feedback) => {

    const card =
      document.createElement("div");


    card.className =
      "feedback-card";


    card.innerHTML = `

      <div class="feedback-top">

        <div>

          <h3>
            ${escapeHTML(feedback.name)}
          </h3>

          <p class="course">
            ${escapeHTML(feedback.course || "Not specified")}
          </p>

        </div>


        <strong>
          ${feedback.rating} ⭐
        </strong>

      </div>


      <p class="comment">
        ${escapeHTML(feedback.comment)}
      </p>


      <p class="date">
        ${new Date(
          feedback.createdAt
        ).toLocaleString()}
      </p>


      <div class="card-actions">

        <button
          class="edit-btn"
          onclick="editFeedback('${feedback._id}')"
        >
          Edit
        </button>


        <button
          class="delete-btn"
          onclick="deleteFeedback('${feedback._id}')"
        >
          Delete
        </button>

      </div>

    `;


    feedbackList.appendChild(card);
  });
}



function applyFilters() {

  const search =
    searchInput.value
      .toLowerCase()
      .trim();


  const selectedRating =
    ratingFilter.value;


  const selectedCourse =
    courseFilter.value;


  const filtered =
    allFeedbacks.filter((feedback) => {

      const matchesSearch =

        feedback.name
          .toLowerCase()
          .includes(search)

        ||

        feedback.comment
          .toLowerCase()
          .includes(search);


      const matchesRating =

        selectedRating === "all"

        ||

        Number(feedback.rating) ===
          Number(selectedRating);


      const matchesCourse =

        selectedCourse === "all"

        ||

        feedback.course ===
          selectedCourse;


      return (
        matchesSearch &&
        matchesRating &&
        matchesCourse
      );
    });


  displayFeedbacks(filtered);
}


form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const name =
      nameInput.value.trim();


    const course =
      courseInput.value;


    const rating =
      ratingInput.value;


    const comment =
      commentInput.value.trim();


    if (
      !name ||
      !course ||
      !rating ||
      !comment
    ) {

      alert(
        "Please fill all fields."
      );

      return;
    }


    const feedbackData = {

      name,

      course,

      rating: Number(rating),

      comment,
    };


    try {

      let response;


    

      if (editingId) {

        response =
          await fetch(
            `${API_URL}/${editingId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  feedbackData
                ),
            }
          );

      }

      
      else {

        response =
          await fetch(
            API_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  feedbackData
                ),
            }
          );
      }


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Something went wrong"
        );
      }


      alert(data.message);


      resetForm();


      await loadFeedbacks();


    } catch (error) {

      console.log(error);

      alert(error.message);
    }

  }
);



function editFeedback(id) {

  const feedback =
    allFeedbacks.find(
      (item) => item._id === id
    );


  if (!feedback) {
    return;
  }


 

  editingId = id;




  nameInput.value =
    feedback.name;


  courseInput.value =
    feedback.course || "";


  ratingInput.value =
    feedback.rating;


  commentInput.value =
    feedback.comment;




  document.getElementById(
    "formTitle"
  ).textContent =
    "Edit Feedback";




  submitBtn.textContent =
    "Update Feedback";




  cancelBtn.classList.remove(
    "hidden"
  );

  document
    .getElementById("feedbackForm")
    .scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
}

async function deleteFeedback(id) {

  const confirmDelete =
    confirm(
      "Are you sure you want to delete this feedback?"
    );


  if (!confirmDelete) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to delete feedback"
      );
    }


    alert(data.message);


    await loadFeedbacks();


  } catch (error) {

    console.log(error);

    alert(error.message);
  }
}


cancelBtn.addEventListener(
  "click",
  resetForm
);

function resetForm() {

  form.reset();


  editingId = null;


  document.getElementById(
    "formTitle"
  ).textContent =
    "Submit Feedback";


  submitBtn.textContent =
    "Submit Feedback";


  cancelBtn.classList.add(
    "hidden"
  );
}

searchInput.addEventListener(
  "input",
  applyFilters
);


ratingFilter.addEventListener(
  "change",
  applyFilters
);


courseFilter.addEventListener(
  "change",
  applyFilters
);

refreshBtn.addEventListener(
  "click",
  loadFeedbacks
);

function escapeHTML(value) {

  const div =
    document.createElement("div");


  div.textContent = value;


  return div.innerHTML;
}



loadFeedbacks();
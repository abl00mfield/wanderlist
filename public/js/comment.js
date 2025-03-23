document.addEventListener("DOMContentLoaded", () => {
  const editButtons = document.querySelectorAll(".edit-comment-toggle");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const commentId = button.dataset.commentId;
      const form = document.getElementById(`edit-form-${commentId}`);

      if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
      } else {
        form.style.display = "none";
      }
    });
  });
});

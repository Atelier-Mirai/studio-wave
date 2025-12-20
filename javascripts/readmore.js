document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".readmore-box");
  boxes.forEach((box) => {
    const input = box.querySelector('input[type="checkbox"]');
    const label = box.querySelector("label");
    const container = box.querySelector(".readmore-container");

    if (!input || !label || !container) return;

    const updateState = () => {
      if (input.checked) {
        label.classList.add("is-open");
        label.classList.remove("is-closing");
      } else {
        label.classList.add("is-closing");
        label.classList.remove("is-open");
      }
    };

    input.addEventListener("change", () => {
      updateState();

      if (!input.checked) {
        const handleTransitionEnd = (event) => {
          if (event.target !== container) return;
          label.classList.remove("is-closing");
          container.removeEventListener("transitionend", handleTransitionEnd);
        };
        container.addEventListener("transitionend", handleTransitionEnd);
      }
    });

    updateState();
  });
});

(function () {

  const showSnackbar = (message) => {
    const snack = document.createElement('div');
    snack.classList.add('snackbar');
    snack.innerText = message;
    document.body.appendChild(snack);
    snack.classList.add('show');
    setTimeout(function () {
      snack.className = snack.className.replace("show", "");
      snack.remove();
    }, 3000);
  };

  const copyToClipboard = (str) => {
    navigator.clipboard.writeText(str).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
    showSnackbar('Copied to clipboard 📋');
  };


  document.addEventListener("keydown", function (event) {
    const chatContainer = document.querySelector('.flex .flex-col .items-center');

    if (event.key === "k" && event.ctrlKey) {
      console.log('Copy Shortcut Pressed');
      //when command k is pressed
      const chatbubbles = chatContainer.querySelectorAll('main.w-full .border-b');
      if (chatbubbles.length % 2 === 0) {
        //if last chat is from bot
        const lastChatBubble = chatbubbles.at(-1);
        const text = lastChatBubble.querySelector('.markdown').innerText
        copyToClipboard(text);
      }

    }
  });


  const intervalId = window.setInterval(function () {
    const chatContainer = document.querySelector('.flex .flex-col .items-center');

    //console.log('probing for new chat bubbles');
    const chatbubbles = chatContainer.querySelectorAll('main.w-full .border-b');
    //console.log('chatbubbles', chatbubbles);

    chatbubbles.forEach((chatbox, i) => {
      //console.log('chatbox', chatbox);
      //first chat box needs to be from user, hence all the even chat bubbles are from bot
      if ((i + 1) % 2 === 0) {
        //it is a chat box from bot
        let thumbContainer = chatbox.querySelector('.flex .self-end');

        const CLIPBOARD_CLASS_NAME = 'copy-to-clipboard';

        if (!thumbContainer.classList.contains(CLIPBOARD_CLASS_NAME)) {

          thumbContainer.classList.add(CLIPBOARD_CLASS_NAME);
          thumbContainer.innerHTML = 'Copy to Clipboard 📋';

          thumbContainer.addEventListener('click', function () {

            const text = chatbox.querySelector('.markdown').innerText;
            copyToClipboard(text);

          });
        } else {

        }

      }
    });
  }, 1000);


})();


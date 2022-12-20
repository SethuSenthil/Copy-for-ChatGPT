(function () {

  const chatContainer = document.querySelector('.flex .flex-col .items-center');

  let previousChatCount = 0;

  const intervalId = window.setInterval(function () {
    const chatbubbles = chatContainer.querySelectorAll('main.w-full .border-b');

    if (previousChatCount != chatbubbles.length) {
      previousChatCount = chatbubbles.length;

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

              navigator.clipboard.writeText(text).then(function() {
                console.log('Async: Copying to clipboard was successful!');
              }, function(err) {
                console.error('Async: Could not copy text: ', err);
              });

            });
          }

        }
    });
  }
  }, 1000);


})();


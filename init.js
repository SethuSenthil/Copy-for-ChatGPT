(function () {
  const CHAT_TEXT_SELECTOR = '.markdown';
  const CLIPBOARD_CLASS_NAME = 'copy-to-clipboard';


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
      //console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
    showSnackbar('Copied to clipboard 📋');
  };


  const intervalId = window.setInterval(async function () {
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

        if (!thumbContainer.classList.contains(CLIPBOARD_CLASS_NAME)) {

          thumbContainer.classList.add(CLIPBOARD_CLASS_NAME);
          thumbContainer.innerHTML = 'Copy to Clipboard <img src="https://copygpt.sethusenthil.com/cdn/clipboard-emoji.webp" alt="clipboard emoji" class="emoji"/>';

          thumbContainer.addEventListener('click', function () {

            const text = chatbox.querySelector(CHAT_TEXT_SELECTOR).innerText;
            copyToClipboard(text);

          });
        } else {

        }

      }
    });

    if (chatContainer.getAttribute('listener-injected') !== 'true') {

      //console.log('setting event listener cause its not already there')
      document.addEventListener('keydown', function (event) {
        const chatContainer = document.querySelector('.flex .flex-col .items-center');

        if (event.metaKey && event.key === 'k') {
          //console.log('Copy Shortcut Pressed');
          //when command k is pressed
          const chatbubbles = chatContainer.querySelectorAll('main.w-full .border-b');
          if (chatbubbles.length % 2 === 0) {
            //if last chat is from bot
            const lastChatBubble = chatbubbles[chatbubbles.length - 1];
            const text = lastChatBubble.querySelector(CHAT_TEXT_SELECTOR).innerText
            copyToClipboard(text);
          }

        }
        chatContainer.setAttribute('listener-injected', 'true');
      });

      const textarea = document.querySelector('textarea');

      textarea.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp') {
          if (chatbubbles.length > 0) {
            let lastSetIndex = chatContainer.getAttribute('last-set-index') ?? 0;
            //console.log('lastSetIndex', lastSetIndex);

            if (lastSetIndex >= chatbubbles.length) {
              lastSetIndex = 0;
            }

            lastSetIndex++;

            const lastChatBubble = chatbubbles[chatbubbles.length - lastSetIndex];
            const text = lastChatBubble.innerText

            textarea.value = text;
            chatContainer.setAttribute('last-set-index', lastSetIndex);
          }
        }
      });
    }
  }, 1000);


})();


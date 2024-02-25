import Clipboard from 'clipboard';

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  });

  clipboard.on('success', () => {
    clipboard.destroy();
  });

  clipboard.on('error', () => {
    clipboard.destroy();
  });

  clipboard.onClick(event);
}

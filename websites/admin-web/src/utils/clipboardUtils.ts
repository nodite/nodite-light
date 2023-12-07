import Clipboard from 'clipboard';
export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  }) as Clipboard & { onClick: (...args) => unknown };
  clipboard.on('success', () => {
    clipboard.destroy();
  });
  clipboard.on('error', () => {
    clipboard.destroy();
  });
  clipboard.onClick(event);
}

import Clipboard from 'clipboard';
import Tooltip from 'tooltip.js';

const clipboard = new Clipboard('button');

clipboard.on('success', e => {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    const instance = new Tooltip(e.trigger, {
        title: 'Copied!',
        placement: 'top',
        trigger: 'manual',
    });
    instance.show();

    setTimeout(() => instance.dispose(), 1000);
});
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


document.querySelector('#change').addEventListener('click', () => {
    const packageName = 'sylius/sylius';
    document.querySelector('#package-name').textContent = packageName;

    document.querySelectorAll('img.badge').forEach(node => {
        node.src = mapTypeToBadge(node.getAttribute('data-badge'), packageName).image;
    });

    document.querySelectorAll('input.badge-input').forEach(node => {
        node.value = markdown(
            node.getAttribute('data-badge'),
            packageName
        );
    });


    document.querySelector('#all-badges').setAttribute('data-clipboard-text',
        [
            'badge-stable-version',
            'badge-total-download',
            'badge-unstable-version',
            'badge-license',
            'badge-composer-lock',
        ].map(type => markdown(type, packageName))
        .join(' ')
    );
});

function markdown(badgeType, packageName) {
    const badge = mapTypeToBadge(badgeType, packageName);
    return `[![${badge.label}](${badge.image})](//packagist.org/packages/${packageName})`;
}

function mapTypeToBadge(type, packageName) {
    switch (type) {
        case 'badge-stable-version':
            return {
                label: 'Latest Stable Version',
                image: `https://poser.pugx.org/${packageName}/version`,
            }
        case 'badge-total-download':
            return {
                label: 'Latest Unstable Version',
                image: `https://poser.pugx.org/${packageName}/downloads`,
            }
        case 'badge-unstable-version':
            return {
                label: 'License',
                image: `https://poser.pugx.org/${packageName}/v/unstable`,
            }
        case 'badge-composer-lock':
            return {
                label: 'Composer.lock available',
                image: `https://poser.pugx.org/${packageName}/composerlock`,
            }
        case 'badge-license':
            return {
                label: 'Total downloads',
                image: `https://poser.pugx.org/${packageName}/license`,
            }
        case 'badge-monthly-download':
            return {
                label: 'Monthly downloads',
                image: `https://poser.pugx.org/${packageName}/d/monthly`,
            }
        case 'badge-daily-download':
            return {
                label: 'Daily downloads',
                image: `https://poser.pugx.org/${packageName}/d/daily`,
            }

        default:
            console.log(`${type} not found`);
    }
}
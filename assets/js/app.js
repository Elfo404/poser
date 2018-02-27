import Raven from 'raven-js';
import Clipboard from 'clipboard';
import Tooltip from 'tooltip.js';
import 'awesomplete';
import {debounce} from './debounce';

const DEFAULT_PACKAGE = 'phpunit/phpunit';

if (window.globalVars.APP_DEBUG !== '1') {
    Raven
        .config('https://1435e86eef3d46c5a39525e9dd7a0dab@sentry.io/295017')
        .install();
}

const clipboard = new Clipboard('button');

clipboard.on('success', e => {

    const instance = new Tooltip(e.trigger, {
        title: 'Copied!',
        placement: 'top',
        trigger: 'manual',
    });
    instance.show();

    setTimeout(() => instance.dispose(), 2000);
});

const searchInput = document.querySelector('#search-package');
const awesomplete = new Awesomplete(searchInput, {
    minChars: 3,
    autoFirst: true,
    item: (item) => {
        const [title, description] = item.label;

        const node = document.createElement('li');
        node.classList.add('search-result');

        const titleEl = document.createElement('span');
        titleEl.classList.add('search-result--title');
        titleEl.textContent = title;

        const descriptionEl = document.createElement('span');
        descriptionEl.classList.add('search-result--description');
        descriptionEl.textContent = description;

        node.appendChild(titleEl);
        node.appendChild(descriptionEl);

        return node;
    },
});

const onInputChange = debounce(({target: target}) => {
    const {value} = target;
    if (value.length < 3) {
        return;
    }

    fetch(`/search_packagist?name=${value}`)
        .then(response => response.json())
        .then(data => data.map(repository => ({
            label: [repository.id, repository.description],
            value: repository.id
        })))
        .then(list => {
            awesomplete.list = list
        });
}, 250);

searchInput.addEventListener('input', onInputChange);

searchInput.addEventListener('awesomplete-selectcomplete', function (e) {
    const {value: packageName} = e.text;

    fetch(`/snippet/all/?repository=${packageName}`)
        .then(res => {
            changePackage(packageName);
            res.json().then(renderBadges)
        });
}, false);

function changePackage(packageName) {
    document.getElementById('package-name').innerText = packageName;
    document.getElementById('permalink').setAttribute('href',`/show/${packageName}`);
}

function renderBadges(badges) {
    document.getElementById('badges-container').innerHTML =
        `${badges.badges.map(({label, img, name, markdown}) =>
            `<div class="col-12 col-md-6">
                <h4>${label}</h4>
                <img class="badge" src="${img}">
                <input
                    class="badge-input"
                    data-badge="${name}"
                    readonly
                    type="text"
                    value="${markdown}" title="${label}">
                <button data-clipboard-target=".badge-input[data-badge='${name}']">Copy</button>
            </div>`
        ).join('')}`;
}

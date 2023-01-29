function isValidUrl(url: string) {
    const urlPattern = new RegExp(
        '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$',
        'gi'
    );

    return urlPattern.test(url);
}

function isValidMailTo(value: string) {
    return new RegExp('mailto:([^?]+)', 'gi').test(value);
}

export const Validators = {
    isValidUrl,
    isValidMailTo,
};

function isValidUrl(url: string) {
    const urlPattern = new RegExp(
        '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$',
        'gi'
    );

    return urlPattern.test(url);
}

export const Validators = {
    isValidUrl,
};

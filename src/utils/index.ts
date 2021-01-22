import { leftHand, rightHand, spaceHand } from '../data';

export const getKeystrokeHand = (key: string) => {
    if (leftHand.includes(key.toLocaleLowerCase())) {
        return 'L';
    } else if (rightHand.includes(key.toLocaleLowerCase())) {
        return 'R';
    } else if (spaceHand.includes(key.toLocaleLowerCase())) {
        return 'S';
    }
}

export const getDate = (date: any) => {
    return (
        `${(`0${date.getFullYear()}`).slice(-2)}${(`0${date.getMonth() + 1}`).slice(-2)}${(`0${date.getDate()}`).slice(-2)}`
    );
}

export const getTimestamp = (date: any) => {
    return (
        `${(`0${date.getHours()}`).slice(-2)}:${(`0${date.getMinutes()}`).slice(-2)}:${(`0${date.getSeconds()}`).slice(-2)}.${JSON.stringify(date).substring(21, 24)}`
    )
}

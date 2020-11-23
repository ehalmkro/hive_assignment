export const getTimeRange = (nbOfHours) => {
    const now = new Date();
    const min = new Date();
    min.setHours(now.getHours() - nbOfHours);
    console.log('now it is', now, 'a day ago it was', min)
    return ({min: min, max: now})
}
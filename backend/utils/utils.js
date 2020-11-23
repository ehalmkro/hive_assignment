export const getTimeRange = (nbOfHours) => {
    const now = new Date();
    const min = new Date();
    min.setHours(now.getHours() - nbOfHours);
    return ({min: min, max: now})
}
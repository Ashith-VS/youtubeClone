export const formatViews = (views) => {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';  // Show in millions
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';  // Show in thousands
    }
    return views;  // Show the exact number if less than 1000
}

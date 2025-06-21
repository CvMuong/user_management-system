module.exports = function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m])
    );
};
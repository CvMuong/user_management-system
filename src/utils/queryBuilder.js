const buildUserQuery = ({ keyword, role }) => {
    const filter = {};
    if (keyword) filter.name = { $regex: keyword, $options: 'i' };
    if (role) filter.role = role;
    return filter;
};

module.exports = buildUserQuery;
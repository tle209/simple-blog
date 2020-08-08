const resolver = async (promise) => {
    const resolved = {
        response: null,
        pagination: null,
        error: null
    };

    try {
        const r = await promise;
        resolved.response = r.data.data;
        resolved.pagination = r.data.pagination;
    } catch (e) {
        resolved.error = e;
    }
    return resolved;
};
export default resolver;

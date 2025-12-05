const pagination = async (model, limit, page, query) => {
    const totalRows = await model.find(query).countDocuments();
    const totalPage = Math.ceil(totalRows / limit)
    const next = page + 1;
    const prev = page - 1;
    const hasNext = next <= totalPage ? true : false;
    const hasPrev = prev >= 1? true : false;
    return {
        totalRows,
        totalPage,
        currentPage: page,
        next,
        prev,
        hasNext,
        hasPrev,
    }
}
module.exports = pagination;
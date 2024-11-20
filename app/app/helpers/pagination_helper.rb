module PaginationHelper
  def paginate(query, currentPage: 1, perPage: 10, selectParams: "*", countParam: "*")
    currentPage = currentPage.to_i < 1 ? 1 : currentPage.to_i
    perPage = perPage.to_i < 1 ? 10 : perPage.to_i
    offset = (currentPage - 1) * perPage

    data = query.select(selectParams).limit(perPage).offset(offset)
    total = query.select(countParam).count

    lastPage = (total.to_f / perPage).ceil

    paginationInfo = {
      total: total,
      perPage: perPage,
      currentPage: currentPage,
      lastPage: lastPage,
      prevPage: currentPage > 1 ? currentPage - 1 : nil,
      nextPage: currentPage < lastPage ? currentPage + 1 : nil
    }

    { data: data, paginationInfo: paginationInfo }
  end
end

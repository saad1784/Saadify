class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filters() {
    const queryCopy = { ...this.queryStr };

    const fieldsToRemove = ["keyword", "page", "limit"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    const filter = {};

    // Handle price range
    if (queryCopy["price[gte]"] || queryCopy["price[lte]"]) {
      filter.price = {};
      if (queryCopy["price[gte]"]) {
        filter.price.$gte = Number(queryCopy["price[gte]"]);
      }
      if (queryCopy["price[lte]"]) {
        filter.price.$lte = Number(queryCopy["price[lte]"]);
      }
      delete queryCopy["price[gte]"];
      delete queryCopy["price[lte]"];
    }

    // Merge other filters (if needed)
    Object.assign(filter, queryCopy);


    this.query = this.query.find(filter);
    return this;
  }
  //pagination(resPerPage = 10) {
   // const currentPage = Number(this.queryStr.page) || 1;
   // const skip = resPerPage * (currentPage - 1);
   // this.query = this.query.limit(resPerPage).skip(skip);
   // return this;
  //}

 
}

export default APIFilters;
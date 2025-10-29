import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { updateQueryParam } from '../helping/helping.js';
import { PRODUCT_CATEGORIES } from '../constant/constant.js';

const Filter = () => {
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [showFilter, setShowFilter] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    searchParams.has('min') && setMin(searchParams.get('min'));
    searchParams.has('max') && setMax(searchParams.get('max'));
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setShowFilter(false);
      else setShowFilter(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = (checkbox) => {
    const checkBoxes = document.getElementsByName(checkbox.name);
    checkBoxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });
    if (!checkbox.checked) {
      if (searchParams.has(checkbox.name)) {
        searchParams.delete(checkbox.name);
        navigate(window.location.pathname + '?' + searchParams.toString());
      }
    } else {
      searchParams.set(checkbox.name, checkbox.value);
      navigate(window.location.pathname + '?' + searchParams.toString());
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    searchParams = updateQueryParam(searchParams, 'min', min);
    searchParams = updateQueryParam(searchParams, 'max', max);
    navigate(window.location.pathname + '?' + searchParams.toString());
  };

  const defaultCheckHandler = (checkboxType, checkboxValue) => {
    const value = searchParams.get(checkboxType);
    return checkboxValue === value;
  };

  return (
    <>
      <button
        className="d-md-none mb-4"
        onClick={() => setShowFilter(!showFilter)}
        id="i54"
      >
        Filter <i className="fas fa-filter"></i> 
      </button>

      <div
        className={`border p-3 filter ${showFilter ? 'd-block' : 'd-none d-md-block'}`}
      >
        <h3>Filters</h3>
        <hr />
        <h5 className="filter-heading mb-3">Price</h5>
        <form id="filter_form" className="px-2" onSubmit={handleButtonClick}>
          <div className="row">
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Min"
                name="min"
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Max"
                name="max"
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>
            <div className="col">
              <button type="submit" className="btn btn-primary">GO</button>
            </div>
          </div>
        </form>
        <hr />
        <h5 className="mb-3">Category</h5>
        {PRODUCT_CATEGORIES?.map((category, index) => (
          <div className="form-check" key={index}>
            <input
              className="form-check-input"
              type="checkbox"
              name="category"
              id={`check-${index}`}
              value={category}
              defaultChecked={defaultCheckHandler('category', category)}
              onClick={(e) => handleClick(e.target)}
            />
            <label className="form-check-label" htmlFor={`check-${index}`}>
              {category}
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

export default Filter;

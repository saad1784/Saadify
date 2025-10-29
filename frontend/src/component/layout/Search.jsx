import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Search=()=>{
    const [keyword, setKeyword] = useState("");
    const navigate=useNavigate();

    const submitHandler = (e) => {
    e.preventDefault();
    if (keyword?.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate(`/`);
    }
  };
    return(
        <>
        <form onSubmit={submitHandler}>
            <div class="input-group" id="searchh">
        <input 
        type="text"
        class="form-control" 
        id="search" 
        placeholder="Search" 
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        />
        <Link><span 
        class="input-group-text"
         id="basic-addon2"
         onClick={submitHandler}
         >
            <i class="bi bi-search "></i>
            </span>
            </Link>
            </div>
            </form>
        </>
    )
}
export default Search;
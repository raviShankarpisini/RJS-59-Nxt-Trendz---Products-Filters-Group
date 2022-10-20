import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    filterCategory,
    filteringRating,
    filteringSearch,
    onClickClearButton,
    enteringSearch,
    titleSearch,
  } = props

  const onClickCategory = eachCategoryCategoryId => {
    filterCategory(eachCategoryCategoryId)
  }

  const onClickRating = rating => {
    filteringRating(rating)
  }

  const onChangeSearch = event => {
    filteringSearch(event)
  }

  const onEnterSearch = event => {
    if (event.key === 'Enter') {
      enteringSearch()
    }
  }

  const onClickClearFilters = () => {
    onClickClearButton()
  }
  return (
    <div className="filters-group-container">
      <div className="search-container">
        <input
          type="search"
          className="search-bar"
          onChange={onChangeSearch}
          onKeyDown={onEnterSearch}
          value={titleSearch}
        />
        <BsSearch className="search-icon" />
      </div>

      <h1 className="rating-text">Category</h1>

      {categoryOptions.map(eachCategory => (
        <p
          type="button"
          key={eachCategory.categoryId}
          onClick={() => onClickCategory(eachCategory.categoryId)}
        >
          {eachCategory.name}
        </p>
      ))}
      <h1 className="rating-text">Rating</h1>
      {ratingsList.map(eachRating => (
        <button
          className="stars-button"
          type="button"
          key={eachRating.ratingId}
          onClick={() => onClickRating(eachRating.ratingId)}
        >
          <div className="rating-container">
            <img
              src={eachRating.imageUrl}
              alt={`rating ${eachRating.ratingId}`}
              className="stars-image"
            />
            <p>& up</p>
          </div>
        </button>
      ))}
      <button
        type="button"
        className="clear-button"
        onClick={onClickClearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup

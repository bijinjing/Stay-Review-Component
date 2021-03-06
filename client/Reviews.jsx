import React from 'react'
import $ from 'jquery';
import ReviewList from './components/ReviewList.jsx';
import RatingComp from './components/Rating.jsx';
import Search from './components/Search.jsx';
import SearchSummary from './components/SearchSummary.jsx';
// import styled from 'styled-components';
import Ratings from 'react-ratings-declarative';




const Review_background = styled.div`
  margin-left: 15%;
  margin-right:40%;
  font-size: 14px;
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif;
  line-height: 1.43;
  color: #484848;
  background-color: #fff;
`;


const NewRating = ({newRating})=>{
  return(
    <Ratings
    rating={newRating}
    widgetRatedColors="#008489"
    widgetDimensions="18.5px"
    widgetSpacings='1px'
   >
    <Ratings.Widget/>
    <Ratings.Widget/>
    <Ratings.Widget/>
    <Ratings.Widget/>
    <Ratings.Widget/>
   </Ratings>
  )
}

class Reviews extends React.Component{
  constructor(props) {
    super(props)
    this.state={
      searchStatus:false,
      searchCount:0,
      searchedList:[],
      searchValue:"",
      hostID:67,
      reviewList:[],
      rating:{},
      lastPage:0,
      count:0,
      currentList:[],
      currentPage:1
    }

    this.calculeteAverageRating = this.calculeteAverageRating.bind(this);
    this.currentPageReviewList = this.currentPageReviewList.bind(this);
    this.renderCurrentPage = this.renderCurrentPage.bind(this);
    this.clearSearchValue = this.clearSearchValue.bind(this);
    this.submitSearchValue = this.submitSearchValue.bind(this);
    this.changeSearchValue = this.changeSearchValue.bind(this);
    this.calculateSearchList = this. calculateSearchList.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this)
  }

  //setup for initial rendering
  componentDidMount(){
    const idString = document.URL.split('?')[document.URL.split('?').length-1];
    const id = idString.includes('http')? this.state.hostID : idString

    $.get('http://localhost:5002/api/reviews',{host:id},(data) => {
      const rating = this.calculeteAverageRating(data);
      const count = rating.count;
      const lastPage = Math.ceil(count / 7);
      const currentList = this.currentPageReviewList(1,data,count)



      this.setState({
        lastPage,
        rating,
        reviewList:data,
        currentList,
        count,
        searchStatus:false,
        overallRate:rating.review
      })
    })
  }

  //functions for search bar
  submitSearchValue(){
    if(this.state.searchValue !== "") {
      let keyWord = this.state.searchValue;
      let searchedList = this.calculateSearchList(keyWord);
      let searchCount = searchedList.length
      let lastPage = Math.ceil(searchCount / 7);
      let currentList =this.currentPageReviewList(1,searchedList,searchCount)

      this.setState({
        searchCount,
        searchedList,
        lastPage,
        currentList,
        currentPage:1,
        searchStatus:true,
      })
    }
  }

  changeSearchValue(value){
    this.setState({
      searchValue:value
    })
  }

  clearSearchValue(){
    const lastPage = Math.ceil(this.state.count / 7);
    let currentList =this.currentPageReviewList(1,this.state.reviewList,this.state.count)
    this.setState({
      lastPage,
      currentList,
      searchStatus:false,
      searchValue:"",
      searchCount:0,
      searchedList:[],
      currentPage:1
    })
  }

  //help function to filter reviews that contain key word
  calculateSearchList(keyWord){
    let filteredList = this.state.reviewList.filter((reviewObj) =>
       reviewObj.comments.toUpperCase().includes(keyWord.toUpperCase())
    )
    return filteredList
  }


  //function for reviews rendering
  renderCurrentPage(curPg){
    const currentList = this.state.searchStatus? this.currentPageReviewList(curPg,this.state.searchedList,this.state.searchCount): this.currentPageReviewList(curPg,this.state.reviewList,this.state.count)
    this.setState({
      currentList
    })
  }

  changeCurrentPage(currentPg){
    this.setState({currentPage:currentPg})
  }

  //help function to calculate current page index
  currentPageReviewList(curPg,reviewList,count){
    let beginIndex = (curPg - 1) * 7;
    let endingIndex = Math.min(beginIndex + 6,count-1);
    return reviewList.slice(beginIndex, endingIndex+1);
  }

  //help function to render rating
  calculeteAverageRating(data){
    const ratingList =[...data];
    const length = ratingList.length;
    let newRating = {};
    ratingList.forEach((rating) => {
      let ratingType = ['rating_accuracy', 'rating_communication', 'rating_cleanliness', 'rating_location', 'rating_checkin', 'rating_value'];

      ratingType.forEach((type) => {
        if(!newRating[type]) {
          newRating[type] = rating[type];
        } else {
          newRating[type] += rating[type];
        };
      })
    });

    let total = 0;
    Object.keys(newRating).forEach((key) => {
      total += newRating[key];
      newRating[key] = Math.round(newRating[key]*2/length)/2;
    });
    newRating.review = Math.round(total*2/length/6)/2;
    newRating.count = length;
    return newRating;
  }

  render() {
    return (
      <Review_background>
        <div style={{borderBottom: `1px ridge lightgrey`, display:`flex`, justifyContent: `space-between`}}>
          <div style={{display:`inline-flex`}}>
            <h2>
              {this.state.rating.count} Reviews
            </h2>
            <h2 style={{marginLeft:`15px`}}>
              <NewRating newRating={this.state.rating.review}/>
            </h2>
          </div>
            <h2 style={{marginLeft:`220px`}}>
              <Search
                searchValue={this.state.searchValue}
                clearSearchValue={this.clearSearchValue}
                changeSearchValue = {this.changeSearchValue}
                submitSearchValue={this.submitSearchValue}
              />
            </h2>
        </div>
        {!this.state.searchStatus?
          <RatingComp rating={this.state.rating}/> :
          <SearchSummary
            searchCount={this.state.searchCount}
            searchValue={this.state.searchValue}
            clearSearchValue={this.clearSearchValue}
          />
        }

        {!this.state.searchStatus?
          <ReviewList
            reviewList={this.state.currentList}
            lastPage={this.state.lastPage}
            count={this.state.count}
            currentPage={this.state.currentPage}
            renderCurrentPage = {this.renderCurrentPage}
            searchStatus = {this.state.searchStatus}
            changeCurrentPage = {this.changeCurrentPage}
          />:
          (this.state.searchCount > 0 &&
          <ReviewList
            reviewList={this.state.currentList}
            searchValue={this.state.searchValue}
            lastPage={this.state.lastPage}
            count={this.state.searchCount}
            currentPage={this.state.currentPage}
            renderCurrentPage = {this.renderCurrentPage}
            searchStatus = {this.state.searchStatus}
            changeCurrentPage = {this.changeCurrentPage}
          />)
        }
      </Review_background>
      )
  }
}

export default Reviews;


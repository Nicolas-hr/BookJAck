import { makeStyles } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";
import Collapse from "../components/Collapse";
import FilterIcon from "../components/FilterIcon";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import useGoogleAPI from "../custom-hooks/useGoogleAPI";
import { withProtect } from "../hoc/RouteProtection";
import { palette, sizes } from "../theme";

const useStyles = makeStyles(() => ({
  root: {
    padding: sizes.root.padding,
  },
  header: {
    position: "relative",
  },
  title: {
    color: palette.title,
    fontSize: "40px",
    margin: 0,
  },
  subtitle: {
    color: palette.darkBlue,
    fontStyle: "italic",
    fontSize: "20px",
    fontWeight: 500,
    marginBottom: "30px",
  },
  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
  },
  textFieldAdornment: {
    borderRadius: sizes.input.borderRadius,
    width: "auto",
  },
  filterFieldRadius: {
    borderRadius: sizes.input.borderRadius,
  },
  filterField: {
    width: "calc(100% - 20px)",
    marginLeft: "20px",
  },
  filter: {
    width: "30px",
    height: "30px",
  },
  filterTitle: {
    color: palette.title,
    fontSize: "24px",
  },
  h4: {
    margin: "10px",
  },
}));

const Browse: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [bookName, setbookName] = useState<string>();
  const [authorName, setAuthorName] = useState<string>();
  const { searchBook } = useGoogleAPI();

  // Used to perform a call to the GB API after the user stopped typign
  const doneTypingInterval = 100;
  let typingTimer: NodeJS.Timeout;

  /**
   * Store the book name
   * @param event onChange event
   */
  const handleBookChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setbookName(event.target.value as string);
  };

  /**
   * Store the author name
   * @param event onChange event
   */
  const handleAuthorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAuthorName(event.target.value as string);
  };

  /**
   * Toggle the filter drawer
   */
  const toggleFilter = (): void => {
    setOpen(!open);
  };

  /**
   * Use the Google Books API hooks
   */
  const performAPICall = () => {
    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      searchBook(bookName, authorName).then((res) => console.log(res));
    }, doneTypingInterval);
  };

  return (
    <React.Fragment>
      <Navbar />

      <header className={classes.header}>
        <div className={`title ${classes.root}`}>
          <h1 className={classes.title}>Browse</h1>
          <div className={classes.subtitle}>Search your favorite book</div>
        </div>

        <div className={`${classes.search} ${classes.root}`}>
          <TextField
            id="book-name"
            label="Book name"
            variant="outlined"
            onChange={handleBookChange}
            onKeyUp={() => {
              performAPICall();
            }}
            onKeyDown={() => {
              clearTimeout(typingTimer);
            }}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon></SearchIcon>
                </InputAdornment>
              ),
              classes: {
                adornedEnd: classes.textFieldAdornment,
              },
            }}
          />

          <div className={classes.filter} onClick={() => toggleFilter()}>
            <FilterIcon></FilterIcon>
          </div>
        </div>

        <Collapse open={open}>
          <h3 className={classes.filterTitle}>Filters</h3>

          <h4 className={classes.h4}>Author name</h4>
          <TextField
            id="author-name"
            variant="outlined"
            className={classes.filterField}
            onChange={handleAuthorChange}
            onKeyUp={() => {
              performAPICall();
            }}
            onKeyDown={() => {
              clearTimeout(typingTimer);
            }}
            size="small"
            InputProps={{
              className: classes.filterFieldRadius,
            }}
          />
        </Collapse>
      </header>

      <Footer />
    </React.Fragment>
  );
};

export default withProtect(Browse);

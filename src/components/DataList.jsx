import React, { useEffect, useState, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import split from 'lodash/split';
import filter from 'lodash/filter';
import keys from 'lodash/keys';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  entry: {
    width: "100%",
    display: "flex",
    border: "solid 1px grey",
    borderRadius: "5px"
  }

}));

const DataList = memo(props => {
  const classes = useStyles();
  const collectionSort = get(props, 'collectionUI.sort');
  const collectionFilter = get(props, 'collectionUI.filter');
  const collectionData = get(props, 'collection.data')
  const [renderingCollection, setRenderingCollection] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const searchValues = split(get(collectionFilter, keys(collectionFilter)[0]), " ");
    const searchRegex = RegExp(searchValues.join('|'), 'i')
    const filterKey = keys(collectionFilter)[0]
    let processedData = filter(collectionData, item => searchRegex.test(item[filterKey]))
    processedData = sortBy(processedData, collectionSort)
    setRenderingCollection(processedData)
    setSelectedIndex(null)
  }, [collectionSort, collectionFilter, collectionData])


  const handleListItemClick = localDataIndex => {
    setSelectedIndex(localDataIndex)
    const appDataIndex = collectionData.indexOf(renderingCollection[localDataIndex])
    props.onItemSelect({ itemKey: appDataIndex });
  };

  const handleOnDelete = (event, localDataIndex) => {
    event.stopPropagation();
    setSelectedIndex(-1)
    const appDataIndex = collectionData.indexOf(renderingCollection[localDataIndex])
    props.onDelete({ itemKey: appDataIndex })
  }

  return (
    <Paper hidden={props.hidden} className={classes.root}>
      <List>
        {renderingCollection.map((item, index) => {
          return <ListItem
            dense
            button
            key={index}
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index)} >
            <Paper className={classes.entry}>
              {props.renderItem({ itemData: item, collection: props.collection, collectionUI: props.collectionUI, dependencies: props.dependencies })}
              {props.onDelete ?
                <IconButton color="secondary" onClick={(event) => handleOnDelete(event, index)} >
                  <DeleteIcon />
                </IconButton>
                : null}
            </Paper>
          </ListItem>
        })}
      </List>
    </Paper>
  );
});

export default DataList;
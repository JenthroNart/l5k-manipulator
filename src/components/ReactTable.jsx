import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import Paper from '@material-ui/core/Paper';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import DeleteIcon from '@material-ui/icons/Delete';


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles(theme => ({
    root: {
    },
}));

const ReactTable = memo(props => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <MaterialTable
                title={props.Title}
                columns={[
                    { title: 'Name', field: 'verbose_name' },
                    { title: 'Type', field: 'type' },
                ]}
                data={props.Items}
                icons={tableIcons}
                options={{
                    selection: true,
                    filtering: true,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 25, 50],
                }}
                detailPanel={[
                    {
                        tooltip: 'Show Content',
                        render: rowData => {
                            return (
                                <div style={{ maxWidth: 300 }}>
                                    <pre>
                                        {rowData.content}
                                    </pre>
                                </div>
                            )
                        },
                    },
                ]}
                actions={[
                    {
                        tooltip: 'Remove Selected Item',
                        icon: () => <DeleteIcon />,
                        onClick: (event, data) => props.onDelete(data),
                    }
                ]}
            />
        </Paper>
    )
})

export default ReactTable
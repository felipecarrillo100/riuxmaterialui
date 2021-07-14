import React from "react";
import {createStyles, TableHead, Theme, withStyles, Grid, TextField} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";


function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


interface Props {
    rows: any[];
    columns?: object | string[];
    searchFields?: string[];
    dense?: boolean;
    rowsPerPage?: number;
    onSelectionChanged?: (arr: any[]) => void;
    classes: {
        visuallyHidden: any;
        table: any;
    };
}

type Order = 'asc' | 'desc';

interface State {
    order: Order;
    orderBy: string;
    page: number;
    rowsPerPage: number;
    selected: any[];
    text: string;
}

class BasicTable extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            orderBy: '',
            order: 'asc',
            page: 0,
            rowsPerPage: this.props.rowsPerPage ? this.props.rowsPerPage : 5,
            selected: [],
            text: ''
        }
    }

    tableHead = (headCells: any[]) => {
        const { classes }  = this.props;
        const numSelected = this.state.selected.length;
        const onSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                this.selectionChanged(this.props.rows);
                return;
            }
            this.selectionChanged([]);
        }
        const onRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
            const isAsc = this.state.orderBy === property && this.state.order === 'asc';
            this.setState({
                order: isAsc ? 'desc' : 'asc',
                orderBy: property
            })
        };

        const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };
        const rowCount = this.props.rows.length;
        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{'aria-label': 'Select all'}}
                        />
                    </TableCell>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'default'}
                            sortDirection={this.state.orderBy === headCell.id ? this.state.order : false}
                        >
                            <TableSortLabel
                                active={this.state.orderBy === headCell.id}
                                direction={this.state.orderBy === headCell.id ? this.state.order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {this.state.orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                             {this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        )
    }

    selectionChanged = (selected: any[]) => {
        this.setState({
            selected
        }, () => {
            if (typeof this.props.onSelectionChanged === "function") {
                this.props.onSelectionChanged(this.state.selected);
            }
        })
    }

    tableBody = (rowsPaginated: any[], rowsFiltered: any[], headCells: any[]) => {
        const handleClick = (event: React.MouseEvent<unknown>, row: any) => {
            const selectedIndex = this.state.selected.indexOf(row);
            let newSelected: string[] = [];

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(this.state.selected, row);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(this.state.selected.slice(1));
            } else if (selectedIndex === this.state.selected.length - 1) {
                newSelected = newSelected.concat(this.state.selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    this.state.selected.slice(0, selectedIndex),
                    this.state.selected.slice(selectedIndex + 1),
                );
            }
            this.selectionChanged(newSelected);
        };


        const isSelected = (row: any) => {
            const x = this.state.selected.indexOf(row) !== -1;
            return x;
        }
        const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.props.rows.length - this.state.page * this.state.rowsPerPage);

        const renderCells = (row: any, labelId: string) => {
            return headCells.map( (item, index ) => {
                if (index === 0) {
                    return (
                        <TableCell key={index} component="th" id={labelId} scope="row" padding="none">
                            {row[item.id]}
                        </TableCell>
                    )
                } else {
                    return (
                        <TableCell key={index} align="right">item</TableCell>
                    )
                }
            });
        }

        return (
            <TableBody>
                { rowsPaginated
                    .map((row, index) => {
                        const isItemSelected = isSelected(row);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                            <TableRow
                                hover
                                onClick={(event) => handleClick(event, row)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.name}
                                selected={isItemSelected}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </TableCell>
                                {renderCells(row, labelId)}
                            </TableRow>
                        );
                    })}
                {emptyRows > 0 && (
                    <TableRow style={{ height: (this.props.dense ? 33 : 53) * emptyRows }}>
                        <TableCell colSpan={6} />
                    </TableRow>
                )}
            </TableBody>
        );
    }

    private static searchCallback(value: string, queryPhrase: string) {
        if (typeof value !== "string") {
            return false;
        }
        return value.toLowerCase().indexOf(queryPhrase) > -1;
    }

    private calculateColumns(newRows?: any) {
        newRows = newRows ? newRows : this.props.rows;
        let columns = {} as any;
        if (this.props.columns) {
            if (Array.isArray(this.props.columns)) {
                const arrayOfKeys = this.props.columns as any[];
                if (newRows.length > 0) {
                    newRows.map((row: any) => {
                        let cellCounter = 0;
                        for (const key of arrayOfKeys) {
                            if (typeof row[key] !== "undefined") {
                                columns[key] = {
                                    label: capitalizeFirstLetter(key),
                                    disablePadding: cellCounter++===0,
                                    id: key,
                                    numeric: typeof row[key] === 'number'
                                };
                            }
                        }
                    })
                }
            } else {
                columns = this.props.columns;
            }
        } else {
            // Autodetect
            columns = {};
            if (newRows.length > 0) {
                newRows.map((row: any) => {
                    let cellCounter = 0;
                    for (const key in row) {
                        if (row.hasOwnProperty(key)) {
                            columns[key] = {
                                label: capitalizeFirstLetter(key),
                                disablePadding: cellCounter++===0,
                                id: key,
                                numeric: typeof row[key] === 'number'
                            };
                        }
                    }
                })
            }
        }
        const heads = Object.keys(columns).map((cell) => (columns[cell]))
        return { columns, heads };
    }


    tablePagination = (rowsPaginated: any[], rowsFiltered: any[]) => {
        const handleChangePage = (event: unknown, newPage: number) => {
            this.setState({
                page: newPage
            });
        };

        const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
            this.props.rowsPerPage
            this.setState({
                page: 0,
                rowsPerPage: parseInt(event.target.value, 10)
            })
        };

        return (
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rowsFiltered.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        );
    }


    render() {
        const handleChange = (event: any) => {
            const {name, value} = event.target;
            this.setState({
                text: value,
                page: 0
            })
        }
        const { classes }  = this.props;
        function stableSort(array: any, comparator: (a: any, b: any) => number) {
            const stabilizedThis = array.map((el: any, index: number) => [el, index] );
            stabilizedThis.sort((a: any, b: any) => {
                const order = comparator(a[0], b[0]);
                if (order !== 0) return order;
                return a[1] - b[1];
            });
            return stabilizedThis.map((el: any) => el[0]);
        }
        function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
            return 0;
        }
        function getComparator(
            order: any,
            orderBy: any,
        ): (a: any, b: any) => number {
            return order === 'desc'
                ? (a, b) => descendingComparator(a, b, orderBy)
                : (a, b) => -descendingComparator(a, b, orderBy);
        }

        const rowsSorted = stableSort(this.props.rows, getComparator(this.state.order, this.state.orderBy));
        const {columns, heads} = this.calculateColumns(this.props.rows);
        // const headCells = headCellsTest;
        const headCells = heads;

        const searchFields = this.props.searchFields || Object.keys(columns);
        const queryPhrase = this.state.text.toLowerCase();
        const rowsFiltered = rowsSorted.filter( (object: any) => {
            return searchFields.some((objectKey) => {
                const value = object[objectKey];
                if (typeof value === "string") {
                    return BasicTable.searchCallback(value, queryPhrase)
                }
                else if (Array.isArray(value)) {
                    return value.some(arrayValue => BasicTable.searchCallback(arrayValue, queryPhrase));
                }
            });
        })
        const rowsPaginated =  rowsFiltered.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)

        return (
            <Paper>
                <Grid container spacing={1}>
                    <Grid item sm={6} >
                        <TextField label="Standard" aria-readonly={"true"} value={""+ this.state.selected.length + " items selected" }/>
                    </Grid>
                    <Grid item sm={6}>
                        <TextField label="Search" value={this.state.text} name="text" onChange={handleChange} fullWidth={true}
                                   InputProps={{
                                       startAdornment: (
                                           <InputAdornment position="start">
                                               <IconButton>
                                                   <SearchIcon />
                                               </IconButton>
                                           </InputAdornment>
                                       )
                                   }}
                        />
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={this.props.dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        {this.tableHead(headCells)}
                        {this.tableBody(rowsPaginated, rowsFiltered, headCells)}
                    </Table>
                </TableContainer>
                {this.tablePagination(rowsPaginated, rowsFiltered)}
            </Paper>
        );
    }
}

const useStyles = createStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
           // minWidth: "100%",
            minWidth: "auto",
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }),
);

export default withStyles(useStyles)(BasicTable);

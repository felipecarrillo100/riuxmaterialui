import {
    Collapse,
    createStyles,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    Theme,
    withStyles
} from "@material-ui/core";
import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import React from "react";

const drawerWidth = 320;

const useStyles = createStyles((theme: Theme) =>
    createStyles(
        {
            list: {
                width: drawerWidth,
            },
            fullList: {
                width: 'auto',
            },
            menuItem: {
                width: drawerWidth,
            },
        }
    )
);

interface Props{
    icon: any;
    text: string;
    classes: {
        list: any;
        fullList: any;
        menuItem: any;
    }
}

interface State {
    open: boolean;
}

class CollapsibleListItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            open: false
        }
    }

    render() {
        const { classes }  = this.props;
        return (
            <React.Fragment>
                <ListItem button onClick={this.handleClick} className={classes.menuItem}>
                    <ListItemIcon>{this.props.icon}</ListItemIcon>
                    <ListItemText primary={this.props.text} />
                    {this.state.open ? <IconExpandLess /> : <IconExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <Divider />
                    <List component="div" disablePadding>
                        {this.props.children}
                    </List>
                </Collapse>
            </React.Fragment>
        );
    }

    handleClick = ( event: any) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            open: !this.state.open
        })
    }
}

export default withStyles(useStyles)(CollapsibleListItem);

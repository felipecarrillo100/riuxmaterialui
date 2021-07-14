import React from "react";
import {
    createStyles,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer, Theme,
    withStyles,
    CardActionArea
} from "@material-ui/core";
import List from '@material-ui/core/List';
import clsx from 'clsx';
import PublicIcon from '@material-ui/icons/Public';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import SquareFootIcon from '@material-ui/icons/SquareFoot';
import CollapsibleListItem from "./colapselistitem/CollapsibleListItem";
import {UIFormRecords} from "../forms/interfaces/UIFormRecords";
import {Command, genereteUniqueID} from "riux/lib/reduxboilerplate/command/reducer";
import {ApplicationCommands} from "riux/lib/commands/ApplicationCommands";
import {
    setWINDOWMANAGERParameters,
    WindowManagerActions
} from "riux/lib/components/desktop/interfaces/WindowManagerActions";
import {Actions} from "riux/lib/reduxboilerplate/actions";
import {SendCommand} from "riux/lib/reduxboilerplate/command/actions";
import {connect} from "react-redux";
import {BasicFormRecords} from "riux/lib/components/forms/BasicForms";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import {LayerTypes} from "riux/lib/components/luciad/interfaces/LayerTypes";
import {BingMapsImagerySet} from "riux/lib/components/luciad/luciadmap/factories/ModelFactory";
import {ReservedLayerID} from "riux/lib/components/luciad/interfaces/ReservedLayerID";
import {IAppState} from "riux/lib/reduxboilerplate/store";
import {WindowElement} from "riux/lib/reduxboilerplate/windowManager/reducer";

const drawerWidth = 320;

const useStyles = createStyles((theme: Theme) =>
    createStyles( {
            list: {
                width: drawerWidth,
            },
            fullList: {
                width: 'auto',
            },
            menuItem: {
                width: drawerWidth,
            },
            root: {
                maxWidth: 345,
            },
            media: {
                height: 140,
            },
        }));

interface OwnProps {
    open: boolean;
    anchor: 'left' | 'top' | 'right' | 'bottom';
    toggleDrawer: any;
    classes: {
        list: any;
        fullList: any;
        menuItem: any;
        root: any;
        media: any;
    }
}

interface StateProps {
    windows?: WindowElement[];
}

interface DispatchProps {
    sendCommand: (command: Command) => void;
}

type Props = StateProps & DispatchProps & OwnProps;

class AppDrawer extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const { classes }  = this.props;
        const list = (anchor: string) => (
            <div
                className={clsx(classes.list, {
                    [classes.fullList]: anchor === 'top' || anchor === 'bottom',
                })}
                role="presentation"
                onClick={this.props.toggleDrawer(anchor, false)}
                onKeyDown={this.props.toggleDrawer(anchor, false)}
            >
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image="./img/hexagon_ignitebanner-1-630x345.jpg"
                            title="RIUX for Material UI"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                RIUX for Material UI
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                This is the Main menu, click on an item to get more options. Feel free to customize this drawer to your own needs.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <List>
                    <CollapsibleListItem icon={<PublicIcon />} text="Basemap" >
                        <ListItem button className={classes.menuItem} onClick={this.connectOpenStreetmap}>
                            <ListItemText inset primary="Openstreetmap" />
                        </ListItem>

                        <ListItem button className={classes.menuItem} onClick={this.connectBingMaps(BingMapsImagerySet.AERIAL, "Bingmaps Satellite")}>
                            <ListItemText inset primary="Satellite" />
                        </ListItem>
                        <ListItem button className={classes.menuItem} onClick={this.connectBingMaps(BingMapsImagerySet.ROAD, "Bingmaps Roads")} >
                            <ListItemText inset primary="Roads" />
                        </ListItem>
                        <ListItem button className={classes.menuItem} onClick={this.connectBingMaps(BingMapsImagerySet.HYBRID, "Bingmaps Hybrid")}>
                            <ListItemText inset primary="Hybrid" />
                        </ListItem>
                        <ListItem button className={classes.menuItem} onClick={this.connectBingMaps(BingMapsImagerySet.DARK, "Bingmaps Dark")}>
                            <ListItemText inset primary="Dark Theme" />
                        </ListItem>
                        <ListItem button className={classes.menuItem} onClick={this.connectBingMaps(BingMapsImagerySet.LIGHT, "Bingmaps Light")}>
                            <ListItemText inset primary="Light Theme" />
                        </ListItem>
                        <ListItem button className={classes.menuItem} onClick={this.connectBingMaps(BingMapsImagerySet.GRAY, "Bingmaps Gray")}>
                            <ListItemText inset primary="Gray Theme" />
                        </ListItem>
                    </CollapsibleListItem>
                </List>
                <Divider />
                <List>
                    <CollapsibleListItem icon={<PublicIcon />} text="Connect" >
                        <ListItem button className={classes.menuItem} onClick={this.connectForm(UIFormRecords.CONNECTWMS)}>
                            <ListItemText inset primary="WMS" />
                        </ListItem>
                        <ListItem button className={classes.menuItem}>
                            <ListItemText inset primary="WMTS" />
                        </ListItem>
                        <ListItem button className={classes.menuItem} onClick={this.connectForm(UIFormRecords.CONNECTWFS)}>
                            <ListItemText inset primary="WFS" />
                        </ListItem>
                        <ListItem button className={classes.menuItem} onClick={this.connectForm(UIFormRecords.CONNECTTMS)}>
                            <ListItemText inset primary="TMS" />
                        </ListItem>
                        <ListItem button className={classes.menuItem} onClick={this.connectCreateGrid}>
                            <ListItemText inset primary="Grid" />
                        </ListItem>
                        <ListItem button className={classes.menuItem} onClick={this.connectForm(UIFormRecords.CONNECTGROUP)}>
                            <ListItemText inset primary="Layer Group" />
                        </ListItem>
                    </CollapsibleListItem>
                </List>
                <Divider />
                <List>
                    <CollapsibleListItem icon={<BusinessCenterIcon />} text="Tools" >
                        <ListItem button className={classes.menuItem} onClick={this.showTools(BasicFormRecords.LayerManager)}>
                            <ListItemIcon ><AccountTreeIcon /></ListItemIcon>
                            <ListItemText primary="Layer Control"  />
                        </ListItem>
                        <ListItem button className={classes.menuItem} onClick={this.showTools(BasicFormRecords.EditAndMeasureTools)}>
                            <ListItemIcon ><SquareFootIcon /></ListItemIcon>
                            <ListItemText primary="Edit & Measure" />
                        </ListItem>
                    </CollapsibleListItem>
                </List>
            </div>
        );

        return (
            <SwipeableDrawer
                anchor={this.props.anchor}
                open={this.props.open}
                onClose={this.props.toggleDrawer(this.props.anchor, false)}
                onOpen={this.props.toggleDrawer(this.props.anchor, true)}
            >
                {list(this.props.anchor)}
            </SwipeableDrawer>
        );
    }

    connectCreateGrid = (event:any) => {
        const command: Command = {
            uid: genereteUniqueID(),
            action: ApplicationCommands.CREATEANYLAYER,
            parameters: {
                "layerType": LayerTypes.GridLayer,
                "layer": {
                    "label": "Grid",
                    "visible": true,
                    "id": ReservedLayerID.GRID
                },
                "autozoom": false
            },
        }
        this.props.sendCommand(command);
    }

    connectOpenStreetmap = (event:any) => {
        const command: Command = {
            uid: genereteUniqueID(),
            action: ApplicationCommands.CREATEANYLAYER,
            parameters: {
                "layerType": LayerTypes.TMSLayer,
                "model": {
                    baseURL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{-y}.png",
                    levelCount: 21,
                    subdomains: "a,b,c".replace(/\s+/g, '').split(',')
                },
                "layer": {
                    "label": "OpenStreetMap",
                    "visible": true,
                    "id": ReservedLayerID.BASE_MAP
                },
                "autozoom": false
            },
        }
        this.props.sendCommand(command);
    }

    public static BingmapsKey = () => {
        return 'AugjqbGwtwHP0n0fUtpZqptdgkixBt5NXpfSzxb7q-6ATmbk-Vs4QnqiW6fhaV-i';
    }

    connectBingMaps = (mapid: string, mapLabel: string) => (event:any) => {
        const command: Command = {
            uid: genereteUniqueID(),
            action: ApplicationCommands.CREATEANYLAYER,
            parameters: {
                "layerType": LayerTypes.BingMapsLayer,
                "model": {
                    imagerySet: mapid,
                    token: AppDrawer.BingmapsKey(),
                },
                "layer": {
                    "label": mapLabel,
                    "visible": true,
                    "id": ReservedLayerID.BASE_MAP
                },
                "autozoom": false
            },
        }
        this.props.sendCommand(command);
    }

    connectForm = (eventKey: string) => (event:any) => {
        const command: Command = {
            uid: genereteUniqueID(),
            action: ApplicationCommands.WINDOWMANAGER,
            parameters: setWINDOWMANAGERParameters({
                id: "CONNECT-FORM",
                actionType: WindowManagerActions.CREATEWINDOW,
                formName: eventKey,
                top: 0,
                left: 0
            })
        }
        this.props.sendCommand(command);
    }

    showTools = (eventKey: string) => (event:any) => {
        const command: Command = {
            uid: genereteUniqueID(),
            action: ApplicationCommands.WINDOWMANAGER,
            parameters: setWINDOWMANAGERParameters({
                id: eventKey,
                toggle: true,
                actionType: WindowManagerActions.CREATEWINDOW,
                formName: eventKey,
                top: 0,
                right: 0
            })
        }
        this.props.sendCommand(command);
    }

}

function mapStateToProps(state: IAppState): StateProps {
    const props: StateProps = {
        windows: state.windowsManager.windows,
    };
    return props;
}

function mapDispatchToProps(dispatch: React.Dispatch<Actions>): DispatchProps {
    return {
        sendCommand: (command: Command) => {
            dispatch(SendCommand(command))
        }
    };
}

const X = connect<unknown, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps
)(AppDrawer);


export default withStyles(useStyles)(X);


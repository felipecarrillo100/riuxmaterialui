import React from "react";

import "./AppNavbar.scss"
import {Command, genereteUniqueID} from "riux/lib/reduxboilerplate/command/reducer";
import {Actions} from "riux/lib/reduxboilerplate/actions";
import {connect} from "react-redux";
import {SendCommand} from "riux/lib/reduxboilerplate/command/actions";
import {ApplicationCommands} from "riux/lib/commands/ApplicationCommands";
import {
    setWINDOWMANAGERParameters,
    WindowManagerActions
} from "riux/lib/components/desktop/interfaces/WindowManagerActions";
import {UIFormRecords} from "../forms/interfaces/UIFormRecords";
import {
    AppBar,
    Button,
    createStyles,
    fade,
    IconButton,
    Theme,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {AccountCircle} from "@material-ui/icons";
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';

import Badge from "@material-ui/core/Badge";
import Menu from "@material-ui/core/Menu";
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuItem from "@material-ui/core/MenuItem";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import SquareFootIcon from "@material-ui/icons/SquareFoot";
import LanguageIcon from '@material-ui/icons/Language';
import MapIcon from '@material-ui/icons/Map';
import {IAppState} from "riux/lib/reduxboilerplate/store";
import {isWindowPresent, WindowElement} from "riux/lib/reduxboilerplate/windowManager/reducer";
import {BasicFormRecords} from "riux/lib/components/forms/BasicForms";
import {setWorkspaceParameters, WorkspaceActions} from "riux/lib/components/luciad/interfaces/WorkspaceActions";


const useStyles = createStyles((theme: Theme) =>
    createStyles(
        {
            root: {
                flexGrow: 1,
            },
            menuButton: {
                marginRight: theme.spacing(2),
            },
            title: {
                flexGrow: 1,
            },
            sectionDesktop: {
                display: 'none',
                [theme.breakpoints.up('md')]: {
                    display: 'flex',
                },
            },
            sectionMobile: {
                display: 'flex',
                [theme.breakpoints.up('md')]: {
                    display: 'none',
                },
            },
        }
    )
);

interface StateProps {
    windows: WindowElement[];
    mapProjection: string;
    favorite2dProjection: string;
}

interface DispatchProps {
    sendCommand: (command: Command) => void;
}

interface OwnProps {
    onMenuClick?: (event: any) => void;
    classes: {
        root: string;
        menuButton: string;
        title: string;
        sectionDesktop: any;
        sectionMobile: any;
    }
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
    anchorEl: any,
    mobileMoreAnchorEl: any
}

class AppNavbar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            anchorEl: null,
            mobileMoreAnchorEl: null
        }
    }

    render() {
        const { classes }  = this.props;
        const { anchorEl, mobileMoreAnchorEl } = this.state;
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
        const isMenuOpen = Boolean(anchorEl);

        const renderMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
            </Menu>
        );

        const EditAndMeasureToolsPresent = isWindowPresent( this.props.windows, BasicFormRecords.EditAndMeasureTools );
        const LayerManagerPresent = isWindowPresent( this.props.windows, BasicFormRecords.LayerManager )

        const renderMobileMenu = (
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMobileMenuOpen}
                onClose={this.handleMobileMenuClose}
            >
                <MenuItem onClick={this.toggle2D3D}>
                    <IconButton color="inherit"  >
                        {this.props.mapProjection === "EPSG:4978"? <MapIcon /> :  <LanguageIcon /> }
                    </IconButton>
                    <p>Toggle 2D/3D</p>
                </MenuItem>
                <MenuItem onClick={this.toggleWindow(BasicFormRecords.LayerManager)} >
                    <IconButton color="inherit" >
                        <AccountTreeIcon
                            style={{ color: !LayerManagerPresent ? "rgb(184,184,184)" : "unset" }}
                        />
                    </IconButton>
                    <p>Layer Control</p>
                </MenuItem>
                <MenuItem onClick={this.toggleWindow(BasicFormRecords.EditAndMeasureTools)}>
                    <IconButton color="inherit"  >
                        <SquareFootIcon
                            style={{ color: !EditAndMeasureToolsPresent? "rgb(184,184,184)" : "unset" }}
                        />
                    </IconButton>
                    <p>Edit&Measure Tools</p>
                </MenuItem>
            </Menu>
        );
        return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={this.onMenuClick} >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        RIUX for Material UI
                    </Typography>
                    <div className={classes.sectionDesktop}>
                        <IconButton color="inherit" onClick={this.toggle2D3D} >
                            {this.props.mapProjection === "EPSG:4978"? <MapIcon /> :  <LanguageIcon /> }
                        </IconButton>
                        <IconButton color="inherit" onClick={this.toggleWindow(BasicFormRecords.LayerManager)} >
                            <AccountTreeIcon
                                style={{ color: !LayerManagerPresent ? "rgb(184,184,184)" : "unset" }}
                                fontSize={!LayerManagerPresent ? "small" : undefined}
                            />
                        </IconButton>
                        <IconButton color="inherit" onClick={this.toggleWindow(BasicFormRecords.EditAndMeasureTools)} >
                            <SquareFootIcon
                                style={{ color: !EditAndMeasureToolsPresent ? "rgb(184,184,184)" : "unset" }}
                                fontSize={!EditAndMeasureToolsPresent ? "small" : undefined}
                            />
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                            <MoreIcon />
                        </IconButton>
                    </div>
                    {renderMobileMenu}
                    {renderMenu}
                </Toolbar>
            </AppBar>
        );
    }

    toggleWindow = (eventKey: string) => (event: any)  => {
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

    onMenuClick = (event: any) => {
        if (typeof this.props.onMenuClick === "function") {
            this.props.onMenuClick(event);
        }
    }

    handleMobileMenuClose = () => {
        this.setState({ mobileMoreAnchorEl: null });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
        this.handleMobileMenuClose();
    };

    connectForm = (eventKey: string) => {
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

    handleMobileMenuOpen = (event:any) => {
        this.setState({ mobileMoreAnchorEl: event.currentTarget });
    };

    private toggle2D3D = () => {
        const Projection3D = "EPSG:4978";
        let newMapProjection: string;
        if (this.props.mapProjection === "EPSG:4978") {
            newMapProjection = this.props.favorite2dProjection;
        } else {
           newMapProjection =  "EPSG:4978"
        }
        const command: Command = {
            uid: genereteUniqueID(),
            action: ApplicationCommands.CHANGEWORKSPACEPROPS,
            parameters: setWorkspaceParameters({
                workspaceAction: WorkspaceActions.CHANGEMAPPROJECTION,
                mapProjection: newMapProjection,
            }),
        }
        this.props.sendCommand(command);
    }


}

function mapStateToProps(state: IAppState): StateProps {
    return {
        windows: state.windowsManager.windows,
        mapProjection: state.map.mapProjection,
        favorite2dProjection: state.map.favorite2dProjection,
    };
}

function mapDispatchToProps(dispatch: React.Dispatch<Actions>): DispatchProps {
    return {
        sendCommand: (command: Command) => {
            dispatch(SendCommand(command))
        }
    };
}

const X = connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps
)(AppNavbar);


export default withStyles(useStyles)(X);



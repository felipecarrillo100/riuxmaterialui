import React from "react";

import Workspace from "riux/lib/components/luciad/workspace/Workspace";
import QuickTest from "riux/lib/components/luciad/testbar/QuickTest";
import GlobalContextMenu from "riux/lib/components/customcontextmenu/GlobalContextMenu";
import {ScreenMessageContainer} from "riux/lib/components/screenmessage/ScreenMessage";
import Desktop from "riux/lib/components/desktop/Desktop";
import {connect, DispatchProp} from "react-redux";
import {setContextMenu} from "riux/lib/reduxboilerplate/contextMenu/actions";
import {Actions} from "riux/lib/reduxboilerplate/actions";
import AppNavbar from "./materialui/navbar/AppNavbar";
import MaterialUIForms from "./materialui/forms/MaterialUIForms";
import { ThemeProvider } from "@material-ui/core";
import {BlueTheme} from "../themes/BlueTheme";
import AppDrawer from "./materialui/drawer/AppDrawer";
import {ModalContainer} from "riux/lib/components/screenmodals/ScreenModal";

interface DispatchProps {
    setContextMenu: (contextMenu: GlobalContextMenu) => void;
}

type Props = DispatchProps;

interface State {
    drawerOpen: boolean;
}

class App extends React.Component<Props, State>{
    private contextMenuRef: any;

    constructor(props:Props) {
        super(props);
        this.state = {
            drawerOpen: false
        }
        MaterialUIForms.RegisterForms();
    }

    componentDidMount() {
        if (this.contextMenuRef) {
            this.props.setContextMenu(this.contextMenuRef);
        }
    }

    render() {
        return (
            <React.Fragment>
                <ThemeProvider theme={BlueTheme}>
                    <div className="App">
                        <Desktop>
                            <Workspace />
                        </Desktop>
                        <AppNavbar onMenuClick={this.toggleDrawer}/>
                        <AppDrawer open={this.state.drawerOpen} anchor="left" toggleDrawer={this.toggleDrawerByAnchor}/>
                        <GlobalContextMenu ref={(ref) => (this.contextMenuRef = ref)} />
                        <ScreenMessageContainer />
                        <ModalContainer />
                    </div>
                </ThemeProvider>
            </React.Fragment>
        );
    }

    private toggleDrawer = (event: any) => {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        })
    }

    private toggleDrawerByAnchor = (anchor: string, open: boolean) => (event: any) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({
            drawerOpen: open
        })
    }
}

function mapStateToProps(state: unknown): unknown {
    return {};
}

function mapDispatchToProps(dispatch: React.Dispatch<Actions>): DispatchProps {
    return {
        setContextMenu: (contextMenu) => dispatch(setContextMenu(contextMenu)),
    };
}

export default connect<unknown, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps
)(App);


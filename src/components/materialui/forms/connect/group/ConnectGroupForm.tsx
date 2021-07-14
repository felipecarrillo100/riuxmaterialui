import * as React from 'react';
import AbstractForm, {AbstractFormProps, SubmitButtonsRow} from "riux/lib/components/forms/abstract/AbstractForm";
import {Command, genereteUniqueID} from "riux/lib/reduxboilerplate/command/reducer";
import {ApplicationCommands} from "riux/lib/commands/ApplicationCommands";
import {LayerTypes} from "riux/lib/components/luciad/interfaces/LayerTypes";
import {Actions} from "riux/lib/reduxboilerplate/actions";
import {SendCommand} from "riux/lib/reduxboilerplate/command/actions";
import {connectForm} from "riux/lib/reduxboilerplate/connectForm";
import {Button, Grid, TextField} from "@material-ui/core";


interface DispatchProps {
    sendCommand: (command: Command) => void;
}

type Props = DispatchProps & AbstractFormProps;

interface State {
    label: string;
}

class ConnectGroupForm extends AbstractForm<Props, State> {
    constructor(props: any) {
        super(props);
        this.setParentTitle('Create Layer Group');
        this.state = {
            label: ""
        }
    }

    protected isReadyToSubmit(): boolean {
        return super.isReadyToSubmit() && this.state.label.length > 0;
    }

    protected onSubmit(event: React.SyntheticEvent) {
        super.onSubmit(event);
        const command: Command = {
            uid: genereteUniqueID(),
            action: ApplicationCommands.CREATEANYLAYER,
            parameters: {
                "layerType": LayerTypes.LayerGroup,
                "layer": {
                    "label": this.state.label,
                    "visible": true
                },
                "autozoom": true
            },

        }
        this.props.sendCommand(command);
    }

    render(): any {
        return (
            <form onSubmit={this.onSubmit} style={{width: 400, maxWidth:"100%"}}>
                <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                    <Grid container>
                        <Grid item sm={12}>
                            <TextField id="standard-basic" label="Label" value={this.state.label} name="label" onChange={this.handleChange} fullWidth={true}  />
                        </Grid>
                    </Grid>
                </Grid>
                <div style={{float: "right", marginTop: 10, marginBottom: 15}}>
                    <Button onClick={this.closeParent} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" disabled={!this.isReadyToSubmit()}>
                        OK
                    </Button>
                </div>
            </form>
        );
    }
}

function mapStateToProps(state: unknown): unknown {
    return {};
}

function mapDispatchToProps(dispatch: React.Dispatch<Actions>): DispatchProps {
    return {
        sendCommand: (command: Command) => {
            dispatch(SendCommand(command))
        }
    };
}

export default connectForm<unknown, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps
)(ConnectGroupForm);

import * as React from 'react';
import FormProvider from "riux/lib/components/forms/FormProvider";
import ConnectWMSForm from "./connect/wms/ConnectWMSForm";
import {UIFormRecords} from "./interfaces/UIFormRecords";
import ConnectGroupForm from "./connect/group/ConnectGroupForm";
import ConnectWFSForm from "./connect/wfs/ConnectWFSForm";
import ConnectTMSForm from "./connect/tms/ConnectTMSForm";
import "./styles/styles.scss"

class MaterialUIForms {
  public static RegisterForms() {

    FormProvider.registerForm({
      name: UIFormRecords.CONNECTWMS,
      form: <ConnectWMSForm />,
    });

    FormProvider.registerForm({
      name: UIFormRecords.CONNECTWFS,
      form: <ConnectWFSForm />,
    });

    FormProvider.registerForm({
      name: UIFormRecords.CONNECTGROUP,
      form: <ConnectGroupForm />,
    });

    FormProvider.registerForm({
      name: UIFormRecords.CONNECTTMS,
      form: <ConnectTMSForm />,
    });

  }
}

export default MaterialUIForms;


import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import './BlueprintModal.css';
import spinnerPath from './resources/images/ui/spinner.gif'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: 'black',
    border: '1px solid lime',
    color: 'lime',
    fontFamily:'monospace',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 5, 4),
    display:'flex',
    flexFlow:'column',
    justifyContent:'center',
    alignItems:'center'
  },
}));

const BlueprintModal = (props)=>{

  const classes = useStyles();

  return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.showBlueprintModal}
        onClose={props.handleCloseBlueprintModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.showBlueprintModal}>
          <div className={classes.paper}>
          <ul className="BlueprintModalList">
            <li><p>Resource needed</p><p>Amount needed</p></li>
            { props.itemBeingCrafted.map((resource)=>{
              return (
                <li><p>{resource.resource_name}({resource.amount_in_inventory})</p>x<p>{resource.amount}</p></li>
              );
            }) }
          </ul>
          <button id="craft" onClick={()=>{props.craftItem(props.itemBeingCrafted)}}>Craft</button>
          { props.craftResponse !=='' ? <div className="CraftResponse">{props.craftResponse}</div> : null}
          { props.craftSent ? <img src={spinnerPath} id="loader" /> : null}
          </div>
        </Fade>
      </Modal>
  );
}

export default BlueprintModal;

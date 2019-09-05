import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import './TradeWithNpcModal.css';
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
    padding: theme.spacing(4, 5, 4)
  },
}));

const TradeWithNpcModal = (props)=>{
  const classes = useStyles();

  return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.showTradeWithNpcModal}
        onClose={props.handleCloseTradeWithNpcModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.showTradeWithNpcModal}>
          <div className={classes.paper}>
            <div className="row TitleRow">
              <div className="col-md-6 col-sm-8 ItemBeingTradedColumn">
                <p>Item Name</p>
              </div>
              <div className="col-md-3 col-sm-2 ItemBeingTradedColumn">
                <p>Amount Wanted</p>
              </div>
              <div className="col-md-3 col-sm-2 ItemBeingTradedColumn">
                <p>Price</p>
              </div>
            </div>
            { props.itemsBeingTraded.map((itemBeingTraded)=>{
              return <div className="row ItemBeingTradedRow">
                <div className="col-md-6 col-sm-8 ItemBeingTradedColumn">
                  <p>{itemBeingTraded.item_name}</p><p>({itemBeingTraded.total_amount})</p>
                </div>
                <div className="col-md-3 col-sm-2 ItemBeingTradedColumn">
                  <input type="text" maxlength={3} value={itemBeingTraded.amount_wanted} onChange={(e)=>props.handleChangeAmountWanted(e,itemBeingTraded.item_id)} />
                </div>
                <div className="col-md-3 col-sm-2 ItemBeingTradedColumn">
                  <p>{itemBeingTraded.total_price} ({itemBeingTraded.item_cost})</p>
                </div>
              </div>
            }) }
            <div className="row ButtonRow">
              <button onClick={props.buyTradedItems}>Buy</button>
              { props.tradeResponse !=='' ? <div className="TradeResponse">{props.tradeResponse}</div> : null}
              { props.tradeSent ? <img src={spinnerPath} /> : null}
            </div>
          </div>
        </Fade>
      </Modal>
  );
}

export default TradeWithNpcModal;

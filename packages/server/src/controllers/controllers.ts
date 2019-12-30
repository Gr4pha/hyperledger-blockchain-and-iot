import { Request, Response } from 'express';
import * as BackEnd from '../convector';


export async function AuthorityController_create_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.AuthorityControllerBackEnd
                .create(params.authority));
            
    } catch(ex) {
        console.log('Error post AuthorityController_create', ex.stack);
        res.status(500).send(ex);
    }
}
export async function AuthorityController_notify_new_process_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.AuthorityControllerBackEnd
                .notify_new_process(params.record_id,params.authority_id,params.process_id,params.transport_id));
            
    } catch(ex) {
        console.log('Error post AuthorityController_notify_new_process', ex.stack);
        res.status(500).send(ex);
    }
}
export async function AuthorityController_approve_process_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.AuthorityControllerBackEnd
                .approve_process(params.authority_id,params.process_id));
            
    } catch(ex) {
        console.log('Error post AuthorityController_approve_process', ex.stack);
        res.status(500).send(ex);
    }
}
export async function AuthorityController_refuse_process_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.AuthorityControllerBackEnd
                .refuse_process(params.authority_id,params.process_id));
            
    } catch(ex) {
        console.log('Error post AuthorityController_refuse_process', ex.stack);
        res.status(500).send(ex);
    }
}
export async function AuthorityController_get_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.AuthorityControllerBackEnd
            .get(params.authority_id));
        
    } catch(ex) {
        console.log('Error get AuthorityController_get', ex.stack);
        res.status(500).send(ex);
    }
}
export async function AuthorityController_get_record_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.AuthorityControllerBackEnd
            .get_record(params.record_id));
        
    } catch(ex) {
        console.log('Error get AuthorityController_get_record', ex.stack);
        res.status(500).send(ex);
    }
}
export async function AuthorityController_get_all_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.AuthorityControllerBackEnd
            .get_all());
        
    } catch(ex) {
        console.log('Error get AuthorityController_get_all', ex.stack);
        res.status(500).send(ex);
    }
}
export async function AuthorityController_get_all_records_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.AuthorityControllerBackEnd
            .get_all_records());
        
    } catch(ex) {
        console.log('Error get AuthorityController_get_all_records', ex.stack);
        res.status(500).send(ex);
    }
}
export async function CrossBorderController_create_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.CrossBorderControllerBackEnd
                .create(params.crossborder));
            
    } catch(ex) {
        console.log('Error post CrossBorderController_create', ex.stack);
        res.status(500).send(ex);
    }
}
export async function CrossBorderController_cross_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.CrossBorderControllerBackEnd
                .cross(params.record_id,params.crossborder_id,params.transport_id));
            
    } catch(ex) {
        console.log('Error post CrossBorderController_cross', ex.stack);
        res.status(500).send(ex);
    }
}
export async function CrossBorderController_get_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.CrossBorderControllerBackEnd
            .get(params.crossborder_id));
        
    } catch(ex) {
        console.log('Error get CrossBorderController_get', ex.stack);
        res.status(500).send(ex);
    }
}
export async function CrossBorderController_get_record_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.CrossBorderControllerBackEnd
            .get_record(params.record_id));
        
    } catch(ex) {
        console.log('Error get CrossBorderController_get_record', ex.stack);
        res.status(500).send(ex);
    }
}
export async function CrossBorderController_get_all_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.CrossBorderControllerBackEnd
            .get_all());
        
    } catch(ex) {
        console.log('Error get CrossBorderController_get_all', ex.stack);
        res.status(500).send(ex);
    }
}
export async function CrossBorderController_get_all_records_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.CrossBorderControllerBackEnd
            .get_all_records());
        
    } catch(ex) {
        console.log('Error get CrossBorderController_get_all_records', ex.stack);
        res.status(500).send(ex);
    }
}
export async function CrossBorderController_get_tx_history_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.CrossBorderControllerBackEnd
            .get_tx_history(params.crossborder_id));
        
    } catch(ex) {
        console.log('Error get CrossBorderController_get_tx_history', ex.stack);
        res.status(500).send(ex);
    }
}
export async function DGController_create_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.DGControllerBackEnd
                .create(params.dg));
            
    } catch(ex) {
        console.log('Error post DGController_create', ex.stack);
        res.status(500).send(ex);
    }
}
export async function DGController_get_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.DGControllerBackEnd
            .get(params.dg_id));
        
    } catch(ex) {
        console.log('Error get DGController_get', ex.stack);
        res.status(500).send(ex);
    }
}
export async function DGController_get_all_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.DGControllerBackEnd
            .get_all());
        
    } catch(ex) {
        console.log('Error get DGController_get_all', ex.stack);
        res.status(500).send(ex);
    }
}
export async function DGController_get_tx_history_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.DGControllerBackEnd
            .get_tx_history(params.dg_id));
        
    } catch(ex) {
        console.log('Error get DGController_get_tx_history', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_create_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .create(params.iot));
            
    } catch(ex) {
        console.log('Error post IoTController_create', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_attach_to_dg_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .attach_to_dg(params.iot_id,params.dg_id));
            
    } catch(ex) {
        console.log('Error post IoTController_attach_to_dg', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_detach_from_dg_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .detach_from_dg(params.iot_id,params.dg_id));
            
    } catch(ex) {
        console.log('Error post IoTController_detach_from_dg', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_attach_to_transport_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .attach_to_transport(params.iot_id,params.transport_id));
            
    } catch(ex) {
        console.log('Error post IoTController_attach_to_transport', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_detach_from_transport_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .detach_from_transport(params.iot_id,params.transport_id));
            
    } catch(ex) {
        console.log('Error post IoTController_detach_from_transport', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_attach_to_warehouse_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .attach_to_warehouse(params.iot_id,params.warehouse_id));
            
    } catch(ex) {
        console.log('Error post IoTController_attach_to_warehouse', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_detach_from_warehouse_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .detach_from_warehouse(params.iot_id,params.warehouse_id));
            
    } catch(ex) {
        console.log('Error post IoTController_detach_from_warehouse', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_get_location_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .get_location(params.iot_id));
            
    } catch(ex) {
        console.log('Error post IoTController_get_location', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_get_location_historic_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .get_location_historic(params.iot_id));
            
    } catch(ex) {
        console.log('Error post IoTController_get_location_historic', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_collect_location_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .collect_location(params.iot_id,params.new_location));
            
    } catch(ex) {
        console.log('Error post IoTController_collect_location', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_get_humidity_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .get_humidity(params.iot_id));
            
    } catch(ex) {
        console.log('Error post IoTController_get_humidity', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_get_humidity_historic_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .get_humidity_historic(params.iot_id));
            
    } catch(ex) {
        console.log('Error post IoTController_get_humidity_historic', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_collect_humidity_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .collect_humidity(params.iot_id,params.new_humidity));
            
    } catch(ex) {
        console.log('Error post IoTController_collect_humidity', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_get_temperature_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .get_temperature(params.iot_id));
            
    } catch(ex) {
        console.log('Error post IoTController_get_temperature', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_get_temperature_historic_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .get_temperature_historic(params.iot_id));
            
    } catch(ex) {
        console.log('Error post IoTController_get_temperature_historic', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_collect_temperature_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .collect_temperature(params.iot_id,params.new_temperature));
            
    } catch(ex) {
        console.log('Error post IoTController_collect_temperature', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_get_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .get(params.iot_id));
        
    } catch(ex) {
        console.log('Error get IoTController_get', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_get_all_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .get_all());
        
    } catch(ex) {
        console.log('Error get IoTController_get_all', ex.stack);
        res.status(500).send(ex);
    }
}
export async function IoTController_get_tx_history_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.IoTControllerBackEnd
            .get_tx_history(params.iot_id));
        
    } catch(ex) {
        console.log('Error get IoTController_get_tx_history', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ProcessController_initialize_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.ProcessControllerBackEnd
                .initialize(params.process));
            
    } catch(ex) {
        console.log('Error post ProcessController_initialize', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ProcessController_schedule_move_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.ProcessControllerBackEnd
                .schedule_move(params.process_id,params.transport_id,params.schedule_departure,params.schedule_arrival));
            
    } catch(ex) {
        console.log('Error post ProcessController_schedule_move', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ProcessController_approve_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.ProcessControllerBackEnd
                .approve(params.process_id,params.authority_id));
            
    } catch(ex) {
        console.log('Error post ProcessController_approve', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ProcessController_refuse_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.ProcessControllerBackEnd
                .refuse(params.process_id,params.authority_id));
            
    } catch(ex) {
        console.log('Error post ProcessController_refuse', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ProcessController_move_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.ProcessControllerBackEnd
                .move(params.process_id,params.from,params.to));
            
    } catch(ex) {
        console.log('Error post ProcessController_move', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ProcessController_deliver_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.ProcessControllerBackEnd
                .deliver(params.process_id));
            
    } catch(ex) {
        console.log('Error post ProcessController_deliver', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ProcessController_finalize_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.ProcessControllerBackEnd
                .finalize(params.process_id));
            
    } catch(ex) {
        console.log('Error post ProcessController_finalize', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ProcessController_get_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.ProcessControllerBackEnd
            .get(params.process_id));
        
    } catch(ex) {
        console.log('Error get ProcessController_get', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ProcessController_get_all_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.ProcessControllerBackEnd
            .get_all());
        
    } catch(ex) {
        console.log('Error get ProcessController_get_all', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ProcessController_get_tx_history_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.ProcessControllerBackEnd
            .get_tx_history(params.process_id));
        
    } catch(ex) {
        console.log('Error get ProcessController_get_tx_history', ex.stack);
        res.status(500).send(ex);
    }
}
export async function TransportController_create_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.TransportControllerBackEnd
                .create(params.transport));
            
    } catch(ex) {
        console.log('Error post TransportController_create', ex.stack);
        res.status(500).send(ex);
    }
}
export async function TransportController_move_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.TransportControllerBackEnd
                .move(params.transport_id,params.from,params.to));
            
    } catch(ex) {
        console.log('Error post TransportController_move', ex.stack);
        res.status(500).send(ex);
    }
}
export async function TransportController_get_location_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.TransportControllerBackEnd
            .get_location(params.transport_id));
        
    } catch(ex) {
        console.log('Error get TransportController_get_location', ex.stack);
        res.status(500).send(ex);
    }
}
export async function TransportController_update_location_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await BackEnd.TransportControllerBackEnd
                .update_location(params.transport_id,params.new_location));
            
    } catch(ex) {
        console.log('Error post TransportController_update_location', ex.stack);
        res.status(500).send(ex);
    }
}
export async function TransportController_get_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.TransportControllerBackEnd
            .get(params.transport_id));
        
    } catch(ex) {
        console.log('Error get TransportController_get', ex.stack);
        res.status(500).send(ex);
    }
}
export async function TransportController_get_all_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.TransportControllerBackEnd
            .get_all());
        
    } catch(ex) {
        console.log('Error get TransportController_get_all', ex.stack);
        res.status(500).send(ex);
    }
}
export async function TransportController_get_tx_history_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.TransportControllerBackEnd
            .get_tx_history(params.transport_id));
        
    } catch(ex) {
        console.log('Error get TransportController_get_tx_history', ex.stack);
        res.status(500).send(ex);
    }
}
export async function WarehouseController_create_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.WarehouseControllerBackEnd
            .create(params.warehouse));
            
    } catch(ex) {
        console.log('Error post WarehouseController_create', ex.stack);
        res.status(500).send(ex);
    }
}
export async function WarehouseController_store_dgs_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.WarehouseControllerBackEnd
            .store_dgs(params.warehouse_id,params.process_id));
            
    } catch(ex) {
        console.log('Error post WarehouseController_store_dgs', ex.stack);
        res.status(500).send(ex);
    }
}
export async function WarehouseController_unstore_dgs_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
        res.status(200).send(await BackEnd.WarehouseControllerBackEnd
            .unstore_dgs(params.warehouse_id,params.process_id));
            
    } catch(ex) {
        console.log('Error post WarehouseController_unstore_dgs', ex.stack);
        res.status(500).send(ex);
    }
}
export async function WarehouseController_get_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.WarehouseControllerBackEnd
            .get(params.warehouse_id));
        
    } catch(ex) {
        console.log('Error get WarehouseController_get', ex.stack);
        res.status(500).send(ex);
    }
}
export async function WarehouseController_get_all_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.WarehouseControllerBackEnd
            .get_all());
        
    } catch(ex) {
        console.log('Error get WarehouseController_get_all', ex.stack);
        res.status(500).send(ex);
    }
}
export async function WarehouseController_get_tx_history_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await BackEnd.WarehouseControllerBackEnd
            .get_tx_history(params.warehouse_id));
        
    } catch(ex) {
        console.log('Error get WarehouseController_get_tx_history', ex.stack);
        res.status(500).send(ex);
    }
}
import * as express from 'express';
import { 
    AuthorityController_create_post,
    AuthorityController_notify_new_process_post,
    AuthorityController_approve_process_post,
    AuthorityController_refuse_process_post,
    AuthorityController_get_get,
    AuthorityController_get_record_get,
    AuthorityController_get_all_get,
    AuthorityController_get_all_records_get,
    CrossBorderController_create_post,
    CrossBorderController_cross_post,
    CrossBorderController_get_get,
    CrossBorderController_get_record_get,
    CrossBorderController_get_all_get,
    CrossBorderController_get_all_records_get,
    CrossBorderController_get_tx_history_get,
    DGController_create_post,
    DGController_get_get,
    DGController_get_all_get,
    DGController_get_tx_history_get,
    IoTController_create_post,
    IoTController_attach_to_dg_post,
    IoTController_detach_from_dg_post,
    IoTController_attach_to_transport_post,
    IoTController_detach_from_transport_post,
    IoTController_attach_to_warehouse_post,
    IoTController_detach_from_warehouse_post,
    IoTController_get_location_post,
    IoTController_get_location_historic_post,
    IoTController_collect_location_post,
    IoTController_get_humidity_post,
    IoTController_get_humidity_historic_post,
    IoTController_collect_humidity_post,
    IoTController_get_temperature_post,
    IoTController_get_temperature_historic_post,
    IoTController_collect_temperature_post,
    IoTController_get_get,
    IoTController_get_all_get,
    IoTController_get_tx_history_get,
    ProcessController_initialize_post,
    ProcessController_schedule_move_post,
    ProcessController_approve_post,
    ProcessController_refuse_post,
    ProcessController_move_post,
    ProcessController_deliver_post,
    ProcessController_finalize_post,
    ProcessController_get_get,
    ProcessController_get_all_get,
    ProcessController_get_tx_history_get,
    TransportController_create_post,
    TransportController_move_post,
    TransportController_get_location_get,
    TransportController_update_location_post,
    TransportController_get_get,
    TransportController_get_all_get,
    TransportController_get_tx_history_get,
    WarehouseController_create_post,
    WarehouseController_store_dgs_post,
    WarehouseController_unstore_dgs_post,
    WarehouseController_get_get,
    WarehouseController_get_all_get,
    WarehouseController_get_tx_history_get } from './controllers'
export default express.Router()
.post('/authority/create', AuthorityController_create_post)
.post('/authority/notify_new_process', AuthorityController_notify_new_process_post)
.post('/authority/approve_process', AuthorityController_approve_process_post)
.post('/authority/refuse_process', AuthorityController_refuse_process_post)
.get('/authority/get/:authority_id', AuthorityController_get_get)
.get('/authority/get_record/:record_id', AuthorityController_get_record_get)
.get('/authority/get_all', AuthorityController_get_all_get)
.get('/authority/get_all_records', AuthorityController_get_all_records_get)
.post('/crossborder/create', CrossBorderController_create_post)
.post('/crossborder/cross', CrossBorderController_cross_post)
.get('/crossborder/get/:crossborder_id', CrossBorderController_get_get)
.get('/crossborder/get_record/:record_id', CrossBorderController_get_record_get)
.get('/crossborder/get_all', CrossBorderController_get_all_get)
.get('/crossborder/get_all_records', CrossBorderController_get_all_records_get)
.get('/crossborder/get_tx_history/:crossborder_id', CrossBorderController_get_tx_history_get)
.post('/dg/create', DGController_create_post)
.get('/dg/get/:dg_id', DGController_get_get)
.get('/dg/get_all', DGController_get_all_get)
.get('/dg/get_tx_history/:dg_id', DGController_get_tx_history_get)
.post('/iot/create', IoTController_create_post)
.post('/iot/attach_to_dg', IoTController_attach_to_dg_post)
.post('/iot/detach_from_dg', IoTController_detach_from_dg_post)
.post('/iot/attach_to_transport', IoTController_attach_to_transport_post)
.post('/iot/detach_from_transport', IoTController_detach_from_transport_post)
.post('/iot/attach_to_warehouse', IoTController_attach_to_warehouse_post)
.post('/iot/detach_from_warehouse', IoTController_detach_from_warehouse_post)
.post('/iot/get_location', IoTController_get_location_post)
.post('/iot/get_location_historic', IoTController_get_location_historic_post)
.post('/iot/collect_location', IoTController_collect_location_post)
.post('/iot/get_humidity', IoTController_get_humidity_post)
.post('/iot/get_humidity_historic', IoTController_get_humidity_historic_post)
.post('/iot/collect_humidity', IoTController_collect_humidity_post)
.post('/iot/get_temperature', IoTController_get_temperature_post)
.post('/iot/get_temperature_historic', IoTController_get_temperature_historic_post)
.post('/iot/collect_temperature', IoTController_collect_temperature_post)
.get('/iot/get/:iot_id', IoTController_get_get)
.get('/iot/get_all', IoTController_get_all_get)
.get('/iot/get_tx_history/:iot_id', IoTController_get_tx_history_get)
.post('/process/initialize', ProcessController_initialize_post)
.post('/process/schedule_move', ProcessController_schedule_move_post)
.post('/process/approve', ProcessController_approve_post)
.post('/process/refuse', ProcessController_refuse_post)
.post('/process/move', ProcessController_move_post)
.post('/process/deliver', ProcessController_deliver_post)
.post('/process/finalize', ProcessController_finalize_post)
.get('/process/get/:process_id', ProcessController_get_get)
.get('/process/get_all', ProcessController_get_all_get)
.get('/process/get_tx_history/:process_id', ProcessController_get_tx_history_get)
.post('/transport/create', TransportController_create_post)
.post('/transport/move', TransportController_move_post)
.get('/transport/get_location/:transport_id', TransportController_get_location_get)
.post('/transport/update_location', TransportController_update_location_post)
.get('/transport/get/:transport_id', TransportController_get_get)
.get('/transport/get_all', TransportController_get_all_get)
.get('/transport/get_tx_history/:transport_id', TransportController_get_tx_history_get)
.post('/warehouse/create', WarehouseController_create_post)
.post('/warehouse/store_dgs', WarehouseController_store_dgs_post)
.post('/warehouse/unstore_dgs', WarehouseController_unstore_dgs_post)
.get('/warehouse/get/:warehouse_id', WarehouseController_get_get)
.get('/warehouse/get_all', WarehouseController_get_all_get)
.get('/warehouse/get_tx_history/:warehouse_id', WarehouseController_get_tx_history_get)

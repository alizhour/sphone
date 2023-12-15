import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { authorizationActions } from '../../api/api.slice';

type ReduxProps = ConnectedProps<typeof connector>;

const OrdersScreen = ({ getUserOrder, route }: ReduxProps & any) => {
    const { userData } = route.params;

    const [orderData, setOrderData] = useState<any>([]);

    function formatDateTime(dateTimeString: any) {
        const dateTime = new Date(dateTimeString);
        const date = dateTime.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const time = dateTime.toLocaleTimeString('en-US', { hour12: false });

        return `${date} ${time}`;
    }

    const fetchData = async () => {
        const token = userData?.access_token;
        const getUserOrderApi = await getUserOrder(token);
        const orderData = (getUserOrderApi?.payload?.data?.order || []).map((e: any) => ({
            UUID: e?.id,
            id: e?.id,
            amount: e?.amount,
            created_at: formatDateTime(e?.created_at),
            oncePrice: e?.oncePrice,
            address: e?.address,
            notes: e?.notes,
            status: e?.status,
        }));
        setOrderData(orderData);
    }

    useEffect(() => {
        fetchData();
    }, [])
    return (
        <View style={styles.container}>
            {
                orderData.length > 0 ? (
                    <>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Invoice Number</DataTable.Title>
                                <DataTable.Title>Amount</DataTable.Title>
                                <DataTable.Title>Once Price</DataTable.Title>
                                <DataTable.Title>Address</DataTable.Title>
                                <DataTable.Title>Notes</DataTable.Title>
                                <DataTable.Title>Date</DataTable.Title>
                                <DataTable.Title>Status</DataTable.Title>
                            </DataTable.Header>
                            {orderData.map((row: any, index: any) => (
                                <DataTable.Row key={index}>
                                    <DataTable.Cell>{row.UUID}</DataTable.Cell>
                                    <DataTable.Cell>{row.amount}</DataTable.Cell>
                                    <DataTable.Cell>{row.oncePrice}</DataTable.Cell>
                                    <DataTable.Cell>{row.address}</DataTable.Cell>
                                    <DataTable.Cell>{row.notes}</DataTable.Cell>
                                    <DataTable.Cell>{row.created_at}</DataTable.Cell>
                                    <DataTable.Cell>{row.status}</DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable >
                    </>
                ) : (
                    <>
                        <Text style={styles.blackText}>No Orders Yet</Text>
                    </>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    blackText: {
        color: '#555'
    }
});

const mapDispatchToProps = {
    getUserOrder: authorizationActions?.getUserOrder
};

const connector = connect(undefined, mapDispatchToProps);
const OrdersScreenRedux = connector(OrdersScreen);

export { OrdersScreenRedux as OrdersScreen };

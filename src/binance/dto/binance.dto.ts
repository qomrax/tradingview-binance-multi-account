import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AssetBalanceDto {
    @ApiProperty({ example: 'BTC', description: 'Asset symbol', required: true })
    @IsString()
    asset: string;

    @ApiProperty({ example: '0.5', description: 'Free balance', required: true })
    @IsString()
    free: string;

    @ApiProperty({ example: '0.0', description: 'Locked balance', required: true })
    @IsString()
    locked: string;
}

export class AccountDto {
    @ApiProperty({ example: 'SPOT', description: 'Account type', required: true })
    @IsString()
    accountType: 'MARGIN' | 'SPOT';

    @ApiProperty({ type: [AssetBalanceDto], description: 'Asset balances', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AssetBalanceDto)
    balances: AssetBalanceDto[];

    @ApiProperty({ example: 10, description: 'Buyer commission', required: true })
    @IsNumber()
    buyerCommission: number;

    @ApiProperty({ example: true, description: 'Can deposit flag', required: true })
    @IsBoolean()
    canDeposit: boolean;

    @ApiProperty({ example: true, description: 'Can trade flag', required: true })
    @IsBoolean()
    canTrade: boolean;

    @ApiProperty({ example: true, description: 'Can withdraw flag', required: true })
    @IsBoolean()
    canWithdraw: boolean;

    @ApiProperty({ example: 5, description: 'Maker commission', required: true })
    @IsNumber()
    makerCommission: number;

    @ApiProperty({ example: ['SPOT'], description: 'Permissions', required: true })
    @IsArray()
    @IsString({ each: true })
    permissions: ('MARGIN' | 'SPOT')[];

    @ApiProperty({ example: 5, description: 'Seller commission', required: true })
    @IsNumber()
    sellerCommission: number;

    @ApiProperty({ example: 15, description: 'Taker commission', required: true })
    @IsNumber()
    takerCommission: number;

    @ApiProperty({ example: 1627891234567, description: 'Update time', required: true })
    @IsNumber()
    updateTime: number;
}

export class TradeFeeDto {
    @ApiProperty({ example: 'BTCUSDT', description: 'Trading pair symbol', required: true })
    @IsString()
    symbol: string;

    @ApiProperty({ example: 5, description: 'Maker commission', required: true })
    @IsNumber()
    makerCommission: number;

    @ApiProperty({ example: 5, description: 'Taker commission', required: true })
    @IsNumber()
    takerCommission: number;
}

export class AggregatedTradeDto {
    @ApiProperty({ example: 123456, description: 'Aggregated trade ID', required: true })
    @IsNumber()
    aggId: number;

    @ApiProperty({ example: 'BTCUSDT', description: 'Trading pair symbol', required: true })
    @IsString()
    symbol: string;

    @ApiProperty({ example: '45000.00', description: 'Trade price', required: true })
    @IsString()
    price: string;

    @ApiProperty({ example: '0.001', description: 'Trade quantity', required: true })
    @IsString()
    quantity: string;

    @ApiProperty({ example: 123450, description: 'First trade ID', required: true })
    @IsNumber()
    firstId: number;

    @ApiProperty({ example: 123460, description: 'Last trade ID', required: true })
    @IsNumber()
    lastId: number;

    @ApiProperty({ example: 1627891234567, description: 'Trade timestamp', required: true })
    @IsNumber()
    timestamp: number;

    @ApiProperty({ example: true, description: 'Is buyer maker flag', required: true })
    @IsBoolean()
    isBuyerMaker: boolean;

    @ApiProperty({ example: true, description: 'Was best price flag', required: true })
    @IsBoolean()
    wasBestPrice: boolean;
}

export class DepositAddressDto {
    @ApiProperty({ example: '1A2b3C4d5E6f', description: 'Deposit address', required: true })
    @IsString()
    address: string;

    @ApiProperty({ example: '123456', description: 'Address tag', required: true })
    @IsString()
    tag: string;

    @ApiProperty({ example: 'BTC', description: 'Coin type', required: true })
    @IsString()
    coin: string;

    @ApiProperty({ example: 'https://example.com', description: 'URL for deposit instructions', required: true })
    @IsString()
    url: string;
}

export class WithdrawResponseDto {
    @ApiProperty({ example: 'withdrawal-id-123', description: 'Withdrawal response ID', required: true })
    @IsString()
    id: string;
}

export class PositionAmountDto {
    @ApiProperty({ example: '1.23', description: 'Amount', required: true })
    @IsString()
    amount: string;

    @ApiProperty({ example: '0.05', description: 'Amount in BTC', required: true })
    @IsString()
    amountInBTC: string;

    @ApiProperty({ example: '3000', description: 'Amount in USDT', required: true })
    @IsString()
    amountInUSDT: string;

    @ApiProperty({ example: 'BTC', description: 'Asset', required: true })
    @IsString()
    asset: string;
}

export class MultiAssetsMarginDto {
    @ApiProperty({ example: true, description: 'Multi assets margin flag', required: true })
    @IsBoolean()
    multiAssetsMargin: boolean;
}

export class LendingAccountDto {
    @ApiProperty({ type: [PositionAmountDto], description: 'Position amounts', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PositionAmountDto)
    positionAmountVos: PositionAmountDto[];

    @ApiProperty({ example: '0.1', description: 'Total amount in BTC', required: true })
    @IsString()
    totalAmountInBTC: string;

    @ApiProperty({ example: '5000', description: 'Total amount in USDT', required: true })
    @IsString()
    totalAmountInUSDT: string;

    @ApiProperty({ example: '0.05', description: 'Total fixed amount in BTC', required: true })
    @IsString()
    totalFixedAmountInBTC: string;

    @ApiProperty({ example: '2500', description: 'Total fixed amount in USDT', required: true })
    @IsString()
    totalFixedAmountInUSDT: string;

    @ApiProperty({ example: '0.02', description: 'Total flexible in BTC', required: true })
    @IsString()
    totalFlexibleInBTC: string;

    @ApiProperty({ example: '1000', description: 'Total flexible in USDT', required: true })
    @IsString()
    totalFlexibleInUSDT: string;
}

export class FundingWalletDto {
    @ApiProperty({ example: 'BTC', description: 'Asset', required: true })
    @IsString()
    asset: string;

    @ApiProperty({ example: '0.5', description: 'Available balance', required: true })
    @IsString()
    free: string;

    @ApiProperty({ example: '0.0', description: 'Locked asset', required: true })
    @IsString()
    locked: string;

    @ApiProperty({ example: '0.0', description: 'Freeze asset', required: true })
    @IsString()
    freeze: string;

    @ApiProperty({ example: '0.0', description: 'Withdrawing asset', required: true })
    @IsString()
    withdrawing: string;

    @ApiProperty({ example: '0.001', description: 'BTC valuation', required: true })
    @IsString()
    btcValuation: string;
}

export class NetworkInformationDto {
    @ApiProperty({ example: '^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$', description: 'Address regex', required: true })
    @IsString()
    addressRegex: string;

    @ApiProperty({ example: 'BTC', description: 'Coin', required: true })
    @IsString()
    coin: string;

    @ApiProperty({ example: 'Deposit using Bitcoin network', description: 'Deposit description', required: true })
    @IsString()
    depositDesc: string;

    @ApiProperty({ example: true, description: 'Deposit enabled flag', required: true })
    @IsBoolean()
    depositEnable: boolean;

    @ApiProperty({ example: false, description: 'Is default network flag', required: true })
    @IsBoolean()
    isDefault: boolean;

    @ApiProperty({ example: '^[0-9]{1,}$', description: 'Memo regex', required: true })
    @IsString()
    memoRegex: string;

    @ApiProperty({ example: 3, description: 'Minimum confirmations', required: true })
    @IsNumber()
    minConfirm: number;

    @ApiProperty({ example: 'Bitcoin Network', description: 'Network name', required: true })
    @IsString()
    name: string;

    @ApiProperty({ example: 'BTC', description: 'Network identifier', required: true })
    @IsString()
    network: string;

    @ApiProperty({ example: false, description: 'Reset address status flag', required: true })
    @IsBoolean()
    resetAddressStatus: boolean;

    @ApiProperty({ example: 'Follow special instructions', description: 'Special tips', required: true })
    @IsString()
    specialTips: string;

    @ApiProperty({ example: 1, description: 'Unlock confirm count', required: true })
    @IsNumber()
    unLockConfirm: number;

    @ApiProperty({ example: 'Bitcoin', description: 'Coin name', required: true })
    @IsString()
    depositTip: string;

    @ApiProperty({ example: 'Fee: 0.0005 BTC', description: 'Withdraw description', required: true })
    @IsString()
    withdrawDesc: string;

    @ApiProperty({ example: true, description: 'Withdraw enabled flag', required: true })
    @IsBoolean()
    withdrawEnable: boolean;

    @ApiProperty({ example: 0.0005, description: 'Withdraw fee', required: true })
    @IsNumber()
    withdrawFee: number;

    @ApiProperty({ example: 1, description: 'Withdraw integer multiple', required: true })
    @IsNumber()
    withdrawIntegerMultiple: number;

    @ApiProperty({ example: 100, description: 'Maximum withdraw amount', required: true })
    @IsNumber()
    withdrawMax: number;

    @ApiProperty({ example: 0.001, description: 'Minimum withdraw amount', required: true })
    @IsNumber()
    withdrawMin: number;

    @ApiProperty({ example: 'SAME', description: 'Same address flag', required: true })
    @IsString()
    sameAddress: string;
}

export class CoinInformationDto {
    @ApiProperty({ example: 'BTC', description: 'Coin', required: true })
    @IsString()
    coin: string;

    @ApiProperty({ example: true, description: 'Deposit enable flag', required: true })
    @IsBoolean()
    depositAllEnable: boolean;

    @ApiProperty({ example: 10, description: 'Free amount', required: true })
    @IsNumber()
    free: number;

    @ApiProperty({ example: 0, description: 'Freeze amount', required: true })
    @IsNumber()
    freeze: number;

    @ApiProperty({ example: 0, description: 'IPO-able amount', required: true })
    @IsNumber()
    ipoable: number;

    @ApiProperty({ example: 0, description: 'IPO-ing amount', required: true })
    @IsNumber()
    ipoing: number;

    @ApiProperty({ example: false, description: 'Is legal money flag', required: true })
    @IsBoolean()
    isLegalMoney: boolean;

    @ApiProperty({ example: 0, description: 'Locked amount', required: true })
    @IsNumber()
    locked: number;

    @ApiProperty({ example: 'Bitcoin', description: 'Name', required: true })
    @IsString()
    name: string;

    @ApiProperty({ type: [NetworkInformationDto], description: 'Network list', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NetworkInformationDto)
    networkList: NetworkInformationDto[];
}

export class UserAssetDribbletDetailsDto {
    @ApiProperty({ example: 123456, description: 'Transaction ID', required: true })
    @IsNumber()
    transId: number;

    @ApiProperty({ example: '0.001', description: 'Service charge amount', required: true })
    @IsString()
    serviceChargeAmount: string;

    @ApiProperty({ example: '0.01', description: 'Amount', required: true })
    @IsString()
    amount: string;

    @ApiProperty({ example: 1627891234567, description: 'Operate time', required: true })
    @IsNumber()
    operateTime: number;

    @ApiProperty({ example: '0.009', description: 'Transfered amount', required: true })
    @IsString()
    transferedAmount: string;

    @ApiProperty({ example: 'BTC', description: 'From asset', required: true })
    @IsString()
    fromAsset: string;
}

export class UserAssetDribbletsDto {
    @ApiProperty({ example: 1627891234567, description: 'Operate time', required: true })
    @IsNumber()
    operateTime: number;

    @ApiProperty({ example: '0.009', description: 'Total transfered amount', required: true })
    @IsString()
    totalTransferedAmount: string;

    @ApiProperty({ example: '0.001', description: 'Total service charge amount', required: true })
    @IsString()
    totalServiceChargeAmount: string;

    @ApiProperty({ example: 123456, description: 'Transaction ID', required: true })
    @IsNumber()
    transId: number;

    @ApiProperty({ type: [UserAssetDribbletDetailsDto], description: 'Dribblet details', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserAssetDribbletDetailsDto)
    userAssetDribbletDetails: UserAssetDribbletDetailsDto[];
}

export class DustLogDto {
    @ApiProperty({ example: 10, description: 'Total count', required: true })
    @IsNumber()
    total: number;

    @ApiProperty({ type: [UserAssetDribbletsDto], description: 'User asset dribblets', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserAssetDribbletsDto)
    userAssetDribblets: UserAssetDribbletsDto[];
}

export class DustTransferResultDto {
    @ApiProperty({ example: '0.001', description: 'Amount', required: true })
    @IsString()
    amount: string;

    @ApiProperty({ example: 'BTC', description: 'From asset', required: true })
    @IsString()
    fromAsset: string;

    @ApiProperty({ example: 1627891234567, description: 'Operate time', required: true })
    @IsNumber()
    operateTime: number;

    @ApiProperty({ example: '0.0001', description: 'Service charge amount', required: true })
    @IsString()
    serviceChargeAmount: string;

    @ApiProperty({ example: 987654, description: 'Transaction ID', required: true })
    @IsNumber()
    tranId: number;

    @ApiProperty({ example: '0.0009', description: 'Transfered amount', required: true })
    @IsString()
    transferedAmount: string;
}

export class DustTransferDto {
    @ApiProperty({ example: '0.0001', description: 'Total service charge', required: true })
    @IsString()
    totalServiceCharge: string;

    @ApiProperty({ example: '0.0009', description: 'Total transfered', required: true })
    @IsString()
    totalTransfered: string;

    @ApiProperty({ type: [DustTransferResultDto], description: 'Transfer results', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DustTransferResultDto)
    transferResult: DustTransferResultDto[];
}

export class DepositHistoryItemDto {
    @ApiProperty({ example: 1627891234567, description: 'Insert time', required: true })
    @IsNumber()
    insertTime: number;

    @ApiProperty({ example: '0.5', description: 'Amount', required: true })
    @IsString()
    amount: string;

    @ApiProperty({ example: 'BTC', description: 'Coin', required: true })
    @IsString()
    coin: string;

    @ApiProperty({ example: 'BTC', description: 'Network', required: true })
    @IsString()
    network: string;

    @ApiProperty({ example: '1A2b3C4d5E6f', description: 'Address', required: true })
    @IsString()
    address: string;

    @ApiProperty({ example: 'txid123', description: 'Transaction ID', required: true })
    @IsString()
    txId: string;

    @ApiProperty({ example: 1, description: 'Status', required: true })
    @IsNumber()
    status: number;

    @ApiProperty({ example: '123456', description: 'Address tag', required: false })
    @IsString()
    addressTag?: string;

    @ApiProperty({ example: 0, description: 'Transfer type', required: false })
    @IsNumber()
    transferType?: number;

    @ApiProperty({ example: '3/Confirmations', description: 'Confirm times', required: false })
    @IsString()
    confirmTimes?: string;
}

export class DepositHistoryResponseDto {
    @ApiProperty({ type: DepositHistoryItemDto, isArray: true, description: 'Deposit history items', required: true })
    history: DepositHistoryItemDto[];
}

export class WithdrawHistoryItemDto {
    @ApiProperty({ example: 'withdraw-id-123', description: 'ID', required: true })
    @IsString()
    id: string;

    @ApiProperty({ example: '0.5', description: 'Amount', required: true })
    @IsString()
    amount: string;

    @ApiProperty({ example: '0.001', description: 'Transaction fee', required: true })
    @IsString()
    transactionFee: string;

    @ApiProperty({ example: '1A2b3C4d5E6f', description: 'Address', required: true })
    @IsString()
    address: string;

    @ApiProperty({ example: 'BTC', description: 'Coin', required: true })
    @IsString()
    coin: string;

    @ApiProperty({ example: 'txid123', description: 'Transaction ID', required: true })
    @IsString()
    txId: string;

    @ApiProperty({ example: 1627891234567, description: 'Apply time', required: true })
    @IsNumber()
    applyTime: number;

    @ApiProperty({ example: 6, description: 'Status', required: true })
    @IsNumber()
    status: number;

    @ApiProperty({ example: 'BTC', description: 'Network', required: true })
    @IsString()
    network: string;

    @ApiProperty({ example: 0, description: 'Transfer type', required: false })
    @IsNumber()
    transferType?: number;

    @ApiProperty({ example: 'order-id-123', description: 'Withdraw order ID', required: false })
    @IsString()
    withdrawOrderId?: string;
}

export class WithdrawHistoryResponseDto {
    @ApiProperty({ type: WithdrawHistoryItemDto, isArray: true, description: 'Withdraw history items', required: true })
    history: WithdrawHistoryItemDto[];
}

export class AssetDetailItemDto {
    @ApiProperty({ example: '0.001', description: 'Minimum withdraw amount', required: true })
    @IsString()
    minWithdrawAmount: string;

    @ApiProperty({ example: true, description: 'Deposit status', required: true })
    @IsBoolean()
    depositStatus: boolean;

    @ApiProperty({ example: '0.0005', description: 'Withdraw fee', required: true })
    @IsString()
    withdrawFee: string;

    @ApiProperty({ example: true, description: 'Withdraw status', required: true })
    @IsBoolean()
    withdrawStatus: boolean;

    @ApiProperty({ example: 'Tip message', description: 'Deposit tip', required: false })
    @IsString()
    depositTip?: string;
}

export class AssetDetailDto {
    @ApiProperty({ description: 'Mapping of asset details', required: true })
    details: Record<string, AssetDetailItemDto>;
}

export class BNBBurnDto {
    @ApiProperty({ example: true, description: 'Spot BNB burn flag', required: true })
    @IsBoolean()
    spotBNBBurn: boolean;

    @ApiProperty({ example: true, description: 'Interest BNB burn flag', required: true })
    @IsBoolean()
    interestBNBBurn: boolean;
}

export class SetBNBBurnOptionsDto {
    @ApiProperty({ example: true, description: 'Spot BNB burn option', required: false })
    spotBNBBurn?: boolean;

    @ApiProperty({ example: false, description: 'Interest BNB burn option', required: false })
    interestBNBBurn?: boolean;

    @ApiProperty({ example: 5000, description: 'Receive window', required: false })
    @IsNumber()
    recvWindow?: number;
}

export class AccountSnapshotDataDto {
    @ApiProperty({ type: [AssetBalanceDto], description: 'Balances', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AssetBalanceDto)
    balances: AssetBalanceDto[];

    @ApiProperty({ example: 0.123, description: 'Total asset of BTC', required: true })
    @IsNumber()
    totalAssetOfBtc: number;
}

export class AccountSnapshotItemDto {
    @ApiProperty({ type: AccountSnapshotDataDto, description: 'Snapshot data', required: true })
    @ValidateNested()
    @Type(() => AccountSnapshotDataDto)
    data: AccountSnapshotDataDto;

    @ApiProperty({ example: 'SPOT', description: 'Snapshot type', required: true })
    @IsString()
    type: string;

    @ApiProperty({ example: 1627891234567, description: 'Update time', required: true })
    @IsNumber()
    updateTime: number;
}

export class AccountSnapshotDto {
    @ApiProperty({ example: 200, description: 'Response code', required: true })
    @IsNumber()
    code: number;

    @ApiProperty({ example: 'Success', description: 'Response message', required: true })
    @IsString()
    msg: string;

    @ApiProperty({ type: [AccountSnapshotItemDto], description: 'Snapshot items', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AccountSnapshotItemDto)
    snapshotVos: AccountSnapshotItemDto[];
}

export class GetInfoDetailsDto {
    @ApiProperty({ example: '10', description: 'Used weight in 1m', required: false })
    @IsString()
    usedWeight1m?: string;

    @ApiProperty({ example: '5', description: 'Order count in 10s', required: false })
    @IsString()
    orderCount10s?: string;

    @ApiProperty({ example: '20', description: 'Order count in 1m', required: false })
    @IsString()
    orderCount1m?: string;

    @ApiProperty({ example: '100', description: 'Order count in 1h', required: false })
    @IsString()
    orderCount1h?: string;

    @ApiProperty({ example: '200', description: 'Order count in 1d', required: false })
    @IsString()
    orderCount1d?: string;

    @ApiProperty({ example: '150', description: 'Response time', required: false })
    @IsString()
    responseTime?: string;
}

export class GetInfoDto {
    @ApiProperty({ type: GetInfoDetailsDto, description: 'Spot information', required: true })
    @ValidateNested()
    @Type(() => GetInfoDetailsDto)
    spot: GetInfoDetailsDto;

    @ApiProperty({ type: GetInfoDetailsDto, description: 'Futures information', required: true })
    @ValidateNested()
    @Type(() => GetInfoDetailsDto)
    futures: GetInfoDetailsDto;
}

export class UniversalTransferDto {
    @ApiProperty({ example: 'MAIN_C2C', description: 'Transfer type', required: true })
    @IsString()
    type: string;

    @ApiProperty({ example: 'BTC', description: 'Asset', required: true })
    @IsString()
    asset: string;

    @ApiProperty({ example: '0.5', description: 'Amount', required: true })
    @IsString()
    amount: string;

    @ApiProperty({ example: 5000, description: 'Receive window', required: false })
    @IsNumber()
    recvWindow?: number;
}

export class UniversalTransferHistoryDto {
    @ApiProperty({ example: 1627891234567, description: 'Start time', required: false })
    @IsNumber()
    startTime?: number;

    @ApiProperty({ example: 1627892234567, description: 'End time', required: false })
    @IsNumber()
    endTime?: number;

    @ApiProperty({ example: 1, description: 'Current page', required: false })
    @IsNumber()
    current?: number;

    @ApiProperty({ example: 50, description: 'Page size', required: false })
    @IsNumber()
    size?: number;

    @ApiProperty({ example: 5000, description: 'Receive window', required: false })
    @IsNumber()
    recvWindow?: number;
}

export class UniversalTransferHistoryResponseItemDto {
    @ApiProperty({ example: 'BTC', description: 'Asset', required: true })
    @IsString()
    asset: string;

    @ApiProperty({ example: '0.5', description: 'Amount', required: true })
    @IsString()
    amount: string;

    @ApiProperty({ example: 'TRANSFER', description: 'Type', required: true })
    @IsString()
    type: string;

    @ApiProperty({ example: 'SUCCESS', description: 'Status', required: true })
    @IsString()
    status: string;

    @ApiProperty({ example: 123456789, description: 'Transaction ID', required: true })
    @IsNumber()
    tranId: number;

    @ApiProperty({ example: 1627891234567, description: 'Timestamp', required: true })
    @IsNumber()
    timestamp: number;
}

export class UniversalTransferHistoryResponseDto {
    @ApiProperty({ example: '1', description: 'Total', required: true })
    @IsString()
    total: string;

    @ApiProperty({ type: [UniversalTransferHistoryResponseItemDto], description: 'Rows', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UniversalTransferHistoryResponseItemDto)
    rows: UniversalTransferHistoryResponseItemDto[];
}

export class MarginBorrowParentDto {
    @ApiProperty({ example: 'BTC', description: 'Asset', required: true })
    @IsString()
    asset: string;

    @ApiProperty({ example: false, description: 'Is isolated flag', required: false })
    isIsolated?: 'TRUE' | 'FALSE';

    @ApiProperty({ example: '0.5', description: 'Amount', required: true })
    @IsString()
    amount: string;

    @ApiProperty({ example: 5000, description: 'Receive window', required: false })
    @IsNumber()
    recvWindow?: number;
}

export class MarginBorrowCrossDto extends MarginBorrowParentDto {
    @ApiProperty({ example: 'FALSE', description: 'Is isolated flag for cross', required: false })
    isIsolated?: 'FALSE';
}

export class MarginBorrowIsolatedDto extends MarginBorrowParentDto {
    @ApiProperty({ example: 'TRUE', description: 'Is isolated flag for isolated borrow', required: true })
    isIsolated: 'TRUE';

    @ApiProperty({ example: 'BTCUSDT', description: 'Symbol', required: true })
    @IsString()
    symbol: string;
}

export type MarginBorrowOptionsDto = MarginBorrowCrossDto | MarginBorrowIsolatedDto;

export class ApiPermissionDto {
    @ApiProperty({ example: true, description: 'IP restrict flag', required: true })
    @IsBoolean()
    ipRestrict: boolean;

    @ApiProperty({ example: 1627891234567, description: 'Creation time', required: true })
    @IsNumber()
    createTime: number;

    @ApiProperty({ example: true, description: 'Enable withdrawals flag', required: true })
    @IsBoolean()
    enableWithdrawals: boolean;

    @ApiProperty({ example: true, description: 'Enable internal transfer flag', required: true })
    @IsBoolean()
    enableInternalTransfer: boolean;

    @ApiProperty({ example: true, description: 'Permits universal transfer flag', required: true })
    @IsBoolean()
    permitsUniversalTransfer: boolean;

    @ApiProperty({ example: true, description: 'Enable vanilla options flag', required: true })
    @IsBoolean()
    enableVanillaOptions: boolean;

    @ApiProperty({ example: true, description: 'Enable reading flag', required: true })
    @IsBoolean()
    enableReading: boolean;

    @ApiProperty({ example: true, description: 'Enable futures flag', required: true })
    @IsBoolean()
    enableFutures: boolean;

    @ApiProperty({ example: true, description: 'Enable margin flag', required: true })
    @IsBoolean()
    enableMargin: boolean;

    @ApiProperty({ example: true, description: 'Enable spot and margin trading flag', required: true })
    @IsBoolean()
    enableSpotAndMarginTrading: boolean;

    @ApiProperty({ example: 1627891234567, description: 'Trading authority expiration time', required: true })
    @IsNumber()
    tradingAuthorityExpirationTime: number;
}

export class MarkPriceDto {
    @ApiProperty({ example: 'markPrice', description: 'Event type', required: true })
    @IsString()
    eventType: string;

    @ApiProperty({ example: 1627891234567, description: 'Event time', required: true })
    @IsNumber()
    eventTime: number;

    @ApiProperty({ example: 'BTCUSDT', description: 'Symbol', required: true })
    @IsString()
    symbol: string;

    @ApiProperty({ example: '45000.00', description: 'Mark price', required: true })
    @IsString()
    markPrice: string;

    @ApiProperty({ example: '45050.00', description: 'Index price', required: true })
    @IsString()
    indexPrice: string;

    @ApiProperty({ example: '45020.00', description: 'Settle price', required: true })
    @IsString()
    settlePrice: string;

    @ApiProperty({ example: '0.0005', description: 'Funding rate', required: true })
    @IsString()
    fundingRate: string;

    @ApiProperty({ example: 0.0006, description: 'Next funding rate', required: true })
    @IsNumber()
    nextFundingRate: number;
}


export class OrderFillDto {
    @ApiProperty({ example: 12345, description: 'Trade ID', required: true })
    @IsNumber()
    tradeId: number;

    @ApiProperty({ example: '45000.00', description: 'Price', required: true })
    @IsString()
    price: string;

    @ApiProperty({ example: '0.001', description: 'Quantity', required: true })
    @IsString()
    qty: string;

    @ApiProperty({ example: '0.00005', description: 'Commission', required: true })
    @IsString()
    commission: string;

    @ApiProperty({ example: 'BNB', description: 'Commission asset', required: true })
    @IsString()
    commissionAsset: string;
}

export class OrderDto {
    @ApiProperty({ example: 'order123', description: 'Client order ID', required: true })
    @IsString()
    clientOrderId: string;

    @ApiProperty({ example: '100.00', description: 'Cummulative quote quantity', required: true })
    @IsString()
    cummulativeQuoteQty: string;

    @ApiProperty({ example: '0.001', description: 'Executed quantity', required: true })
    @IsString()
    executedQty: string;

    @ApiProperty({ type: [OrderFillDto], description: 'Fills', required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderFillDto)
    fills?: OrderFillDto[];

    @ApiProperty({ example: '0.0', description: 'Iceberg quantity', required: false })
    @IsString()
    icebergQty?: string;

    @ApiProperty({ example: false, description: 'Is isolated flag', required: false })
    @IsBoolean()
    isIsolated?: boolean;

    @ApiProperty({ example: true, description: 'Is working flag', required: true })
    @IsBoolean()
    isWorking: boolean;

    @ApiProperty({ example: 123456, description: 'Order ID', required: true })
    @IsNumber()
    orderId: number;

    @ApiProperty({ example: 0, description: 'Order list ID', required: true })
    @IsNumber()
    orderListId: number;

    @ApiProperty({ example: '1.0', description: 'Original quantity', required: true })
    @IsString()
    origQty: string;

    @ApiProperty({ example: '45000.00', description: 'Price', required: true })
    @IsString()
    price: string;

    @ApiProperty({ example: 'BUY', description: 'Order side', required: true })
    @IsString()
    side: string;

    @ApiProperty({ example: 'NEW', description: 'Order status', required: true })
    @IsString()
    status: string;

    @ApiProperty({ example: '45000.00', description: 'Stop price', required: false })
    @IsString()
    stopPrice?: string;

    @ApiProperty({ example: 'BTCUSDT', description: 'Symbol', required: true })
    @IsString()
    symbol: string;

    @ApiProperty({ example: 1627891234567, description: 'Time', required: true })
    @IsNumber()
    time: number;

    @ApiProperty({ example: 'GTC', description: 'Time in force', required: true })
    @IsString()
    timeInForce: string;

    @ApiProperty({ example: 1627891234567, description: 'Update time', required: true })
    @IsNumber()
    updateTime: number;
}

export class FuturesOrderDto {
    @ApiProperty({ example: 'order123', description: 'Client order ID', required: true })
    @IsString()
    clientOrderId: string;

    @ApiProperty({ example: '0.001', description: 'Cumulative quantity', required: true })
    @IsString()
    cumQty: string;

    @ApiProperty({ example: '45.00', description: 'Cumulative quote', required: true })
    @IsString()
    cumQuote: string;

    @ApiProperty({ example: '0.001', description: 'Executed quantity', required: true })
    @IsString()
    executedQty: string;

    @ApiProperty({ example: 123456, description: 'Order ID', required: true })
    @IsNumber()
    orderId: number;

    @ApiProperty({ example: '45000.00', description: 'Average price', required: true })
    @IsString()
    avgPrice: string;

    @ApiProperty({ example: '1.0', description: 'Original quantity', required: true })
    @IsString()
    origQty: string;

    @ApiProperty({ example: '45000.00', description: 'Price', required: true })
    @IsString()
    price: string;

    @ApiProperty({ example: false, description: 'Reduce only flag', required: true })
    @IsBoolean()
    reduceOnly: boolean;

    @ApiProperty({ example: 'BUY', description: 'Order side', required: true })
    @IsString()
    side: string;

    @ApiProperty({ example: 'BOTH', description: 'Position side', required: true })
    @IsString()
    positionSide: string;

    @ApiProperty({ example: 'NEW', description: 'Order status', required: true })
    @IsString()
    status: string;

    @ApiProperty({ example: '45000.00', description: 'Stop price', required: true })
    @IsString()
    stopPrice: string;

    @ApiProperty({ example: false, description: 'Close position flag', required: true })
    @IsBoolean()
    closePosition: boolean;

    @ApiProperty({ example: 'BTCUSDT', description: 'Symbol', required: true })
    @IsString()
    symbol: string;

    @ApiProperty({ example: 'GTC', description: 'Time in force', required: true })
    @IsString()
    timeInForce: string;

    @ApiProperty({ example: 'MARKET', description: 'Order type', required: true })
    @IsString()
    type: string;

    @ApiProperty({ example: 1627891234567, description: 'Update time', required: true })
    @IsNumber()
    updateTime: number;
}

export class OcoOrderDto {
    @ApiProperty({ example: 123456, description: 'Order list ID', required: true })
    @IsNumber()
    orderListId: number;

    @ApiProperty({ example: 'OCO', description: 'Contingency type', required: true })
    @IsString()
    contingencyType: string;

    @ApiProperty({ example: 'RESPONSE', description: 'List status type', required: true })
    @IsString()
    listStatusType: string;

    @ApiProperty({ example: 'EXECUTING', description: 'List order status', required: true })
    @IsString()
    listOrderStatus: string;

    @ApiProperty({ example: 'client-order-123', description: 'List client order ID', required: true })
    @IsString()
    listClientOrderId: string;

    @ApiProperty({ example: 1627891234567, description: 'Transaction time', required: true })
    @IsNumber()
    transactionTime: number;

    @ApiProperty({ example: 'BTCUSDT', description: 'Symbol', required: true })
    @IsString()
    symbol: string;

    @ApiProperty({ type: [OrderDto], description: 'Orders', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderDto)
    orders: OrderDto[];

    @ApiProperty({ type: [OrderDto], description: 'Order reports', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderDto)
    orderReports: OrderDto[];
}

export class AvgPriceResultDto {
    @ApiProperty({ example: 1, description: 'Mins', required: true })
    @IsNumber()
    mins: number;

    @ApiProperty({ example: '45000.00', description: 'Price', required: true })
    @IsString()
    price: string;
}

export class DailyStatsResultDto {
    @ApiProperty({ example: 'BTCUSDT', description: 'Symbol', required: true })
    @IsString()
    symbol: string;

    @ApiProperty({ example: '500', description: 'Price change', required: true })
    @IsString()
    priceChange: string;

    @ApiProperty({ example: '1.1', description: 'Price change percent', required: true })
    @IsString()
    priceChangePercent: string;

    @ApiProperty({ example: '45000.00', description: 'Weighted average price', required: true })
    @IsString()
    weightedAvgPrice: string;

    @ApiProperty({ example: '44900.00', description: 'Previous close price', required: true })
    @IsString()
    prevClosePrice: string;

    @ApiProperty({ example: '45000.00', description: 'Last price', required: true })
    @IsString()
    lastPrice: string;

    @ApiProperty({ example: '0.001', description: 'Last quantity', required: true })
    @IsString()
    lastQty: string;

    @ApiProperty({ example: '44950.00', description: 'Bid price', required: true })
    @IsString()
    bidPrice: string;

    @ApiProperty({ example: '0.5', description: 'Bid quantity', required: true })
    @IsString()
    bidQty: string;

    @ApiProperty({ example: '45050.00', description: 'Ask price', required: true })
    @IsString()
    askPrice: string;

    @ApiProperty({ example: '0.5', description: 'Ask quantity', required: true })
    @IsString()
    askQty: string;

    @ApiProperty({ example: '44800.00', description: 'Open price', required: true })
    @IsString()
    openPrice: string;

    @ApiProperty({ example: '45200.00', description: 'High price', required: true })
    @IsString()
    highPrice: string;

    @ApiProperty({ example: '44700.00', description: 'Low price', required: true })
    @IsString()
    lowPrice: string;

    @ApiProperty({ example: '1000', description: 'Volume', required: true })
    @IsString()
    volume: string;

    @ApiProperty({ example: '45000000', description: 'Quote volume', required: true })
    @IsString()
    quoteVolume: string;

    @ApiProperty({ example: 1627890000000, description: 'Open time', required: true })
    @IsNumber()
    openTime: number;

    @ApiProperty({ example: 1627893600000, description: 'Close time', required: true })
    @IsNumber()
    closeTime: number;

    @ApiProperty({ example: 1000, description: 'First trade ID', required: true })
    @IsNumber()
    firstId: number;

    @ApiProperty({ example: 1100, description: 'Last trade ID', required: true })
    @IsNumber()
    lastId: number;

    @ApiProperty({ example: 100, description: 'Trade count', required: true })
    @IsNumber()
    count: number;
}
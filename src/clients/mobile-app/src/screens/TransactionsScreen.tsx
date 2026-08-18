// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/clients/mobile-app/src/screens/TransactionsScreen.tsx
================================================================================

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Searchbar,
  Button,
  Modal,
  Portal,
  Provider as PaperProvider,
  Title,
  Subheading,
  Divider,
  Chip,
  FAB,
  useTheme,
  Appbar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DateRangePicker } from 'react-native-common-date-picker'; // Assuming a date picker library
import Slider from '@react-native-community/slider';

// Assuming a custom hook for fetching transactions which handles auth, pagination, etc.
import { useTransactions } from '../hooks/useTransactions';
import { Transaction, TransactionCategory, Account } from '../types/transaction';
import { i18n } from '../localization/i18n'; // Assuming i18n setup

// --- Type Definitions ---

type FilterState = {
  dateRange: { startDate: string | null; endDate: string | null };
  amountRange: { min: number; max: number };
  categories: TransactionCategory[];
  accounts: string[]; // Account IDs
  transactionType: 'debit' | 'credit' | 'all';
  status: 'pending' | 'posted' | 'all';
};

type SortState = {
  key: 'date' | 'amount' | 'merchant';
  order: 'asc' | 'desc';
};

// --- Helper & Sub-components ---

const getCategoryIcon = (category: TransactionCategory): string => {
  const iconMap: { [key in TransactionCategory]: string } = {
    Groceries: 'cart-outline',
    Travel: 'airplane',
    Entertainment: 'movie-open-outline',
    Utilities: 'lightbulb-on-outline',
    Shopping: 'shopping-outline',
    Food: 'food-fork-drink',
    Health: 'hospital-box-outline',
    Transfer: 'swap-horizontal',
    Income: 'cash-plus',
    Other: 'shape-outline',
  };
  return iconMap[category] || 'shape-outline';
};

const TransactionItem: React.FC<{ item: Transaction; onPress: () => void }> = React.memo(({ item, onPress }) => {
  const { colors } = useTheme();
  const isDebit = item.amount < 0;
  const amountColor = isDebit ? colors.text : colors.primary;

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.itemIconContainer}>
        <Icon name={getCategoryIcon(item.category)} size={28} color={colors.primary} />
      </View>
      <View style={styles.itemDetailsContainer}>
        <Text style={[styles.itemMerchant, { color: colors.text }]}>{item.merchantName}</Text>
        <Text style={[styles.itemCategory, { color: colors.backdrop }]}>
          {item.category} • {item.accountName}
        </Text>
      </View>
      <View style={styles.itemAmountContainer}>
        <Text style={[styles.itemAmount, { color: amountColor }]}>
          {isDebit ? '-' : ''}${Math.abs(item.amount).toFixed(2)}
        </Text>
        <Text style={[styles.itemDate, { color: colors.backdrop }]}>
          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.emptyContainer}>
      <Icon name="format-list-bulleted-type" size={60} color={colors.disabled} />
      <Title style={{ color: colors.disabled }}>{i18n.t('transactions.noResultsTitle')}</Title>
      <Subheading style={{ color: colors.disabled, textAlign: 'center', paddingHorizontal: 20 }}>
        {i18n.t('transactions.noResultsSubtitle')}
      </Subheading>
      <Button mode="text" onPress={onReset} style={{ marginTop: 20 }}>
        {i18n.t('transactions.clearFilters')}
      </Button>
    </View>
  );
};

const FilterModal: React.FC<{
  visible: boolean;
  onDismiss: () => void;
  applyFilters: (filters: FilterState) => void;
  initialFilters: FilterState;
  // Mock data for filter options, would come from API/context in a real app
  availableCategories: TransactionCategory[];
  availableAccounts: Account[];
}> = ({ visible, onDismiss, applyFilters, initialFilters, availableCategories, availableAccounts }) => {
  const { colors } = useTheme();
  const [localFilters, setLocalFilters] = useState<FilterState>(initialFilters);

  const handleApply = () => {
    applyFilters(localFilters);
    onDismiss();
  };

  const handleReset = () => {
    setLocalFilters(initialFilters);
    applyFilters(initialFilters);
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <Title>{i18n.t('transactions.filtersTitle')}</Title>
          <TouchableOpacity onPress={onDismiss}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Divider />
        <FlatList
          data={[{ key: 'content' }]} // Use FlatList to make content scrollable
          renderItem={() => (
            <View style={styles.modalContent}>
              <Subheading>{i18n.t('transactions.dateRange')}</Subheading>
              <DateRangePicker
                onConfirm={(range) => setLocalFilters(f => ({ ...f, dateRange: { startDate: range.startDate, endDate: range.endDate } }))}
                initialSettings={{
                  selectedDate: localFilters.dateRange.startDate || '',
                  endDate: localFilters.dateRange.endDate || '',
                }}
              >
                <Text style={styles.datePickerText}>
                  {localFilters.dateRange.startDate && localFilters.dateRange.endDate
                    ? `${localFilters.dateRange.startDate} - ${localFilters.dateRange.endDate}`
                    : i18n.t('transactions.selectDateRange')}
                </Text>
              </DateRangePicker>

              <Subheading style={{ marginTop: 20 }}>{i18n.t('transactions.amountRange')}</Subheading>
              <View style={styles.sliderLabels}>
                <Text>${localFilters.amountRange.min}</Text>
                <Text>${localFilters.amountRange.max}</Text>
              </View>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={5000} // This should be dynamic
                step={50}
                value={localFilters.amountRange.max}
                onSlidingComplete={(value) => setLocalFilters(f => ({ ...f, amountRange: { ...f.amountRange, max: value } }))}
              />

              <Subheading style={{ marginTop: 20 }}>{i18n.t('transactions.categories')}</Subheading>
              <View style={styles.chipContainer}>
                {availableCategories.map(cat => (
                  <Chip
                    key={cat}
                    selected={localFilters.categories.includes(cat)}
                    onPress={() => {
                      const newCategories = localFilters.categories.includes(cat)
                        ? localFilters.categories.filter(c => c !== cat)
                        : [...localFilters.categories, cat];
                      setLocalFilters(f => ({ ...f, categories: newCategories }));
                    }}
                    style={styles.chip}
                  >
                    {cat}
                  </Chip>
                ))}
              </View>

              <Subheading style={{ marginTop: 20 }}>{i18n.t('transactions.accounts')}</Subheading>
              <View style={styles.chipContainer}>
                {availableAccounts.map(acc => (
                  <Chip
                    key={acc.id}
                    selected={localFilters.accounts.includes(acc.id)}
                    onPress={() => {
                      const newAccounts = localFilters.accounts.includes(acc.id)
                        ? localFilters.accounts.filter(a => a !== acc.id)
                        : [...localFilters.accounts, acc.id];
                      setLocalFilters(f => ({ ...f, accounts: newAccounts }));
                    }}
                    style={styles.chip}
                  >
                    {acc.name} ({acc.mask})
                  </Chip>
                ))}
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.modalFooter}>
          <Button onPress={handleReset}>{i18n.t('common.reset')}</Button>
          <Button mode="contained" onPress={handleApply}>{i18n.t('common.apply')}</Button>
        </View>
      </Modal>
    </Portal>
  );
};

// --- Main Screen Component ---

const TransactionsScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const initialFilters: FilterState = {
    dateRange: { startDate: null, endDate: null },
    amountRange: { min: 0, max: 5000 },
    categories: [],
    accounts: [],
    transactionType: 'all',
    status: 'all',
  };
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const [sort, setSort] = useState<SortState>({ key: 'date', order: 'desc' });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useTransactions({ query: searchQuery, filters, sort });

  const transactions = useMemo(() => data?.pages.flatMap(page => page.transactions) ?? [], [data]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    // refetch will be triggered by the query key change in useTransactions hook
  };

  const renderItem = useCallback(({ item }: { item: Transaction }) => (
    <TransactionItem
      item={item}
      onPress={() => navigation.navigate('TransactionDetail', { transactionId: item.id })}
    />
  ), [navigation]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  const resetAll = () => {
    setSearchQuery('');
    setFilters(initialFilters);
    setSort({ key: 'date', order: 'desc' });
  };

  // Mock data for filters, would come from a global state/context
  const MOCK_CATEGORIES: TransactionCategory[] = ["Groceries", "Travel", "Entertainment", "Utilities", "Shopping", "Food", "Health", "Transfer", "Income"];
  const MOCK_ACCOUNTS: Account[] = [
    { id: 'acc_1', name: 'Plaid Checking', mask: '0000', type: 'checking' },
    { id: 'acc_2', name: 'Plaid Savings', mask: '1111', type: 'savings' },
    { id: 'acc_3', name: 'Stripe Balance', mask: '2222', type: 'other' },
  ];

  return (
    <PaperProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <Appbar.Header>
          <Appbar.Content title={i18n.t('transactions.screenTitle')} />
          <Appbar.Action icon="magnify" onPress={() => { /* Can expand search here */ }} />
          <Appbar.Action icon="filter-variant" onPress={() => setFilterModalVisible(true)} />
        </Appbar.Header>

        <View style={styles.controlsContainer}>
          <Searchbar
            placeholder={i18n.t('transactions.searchPlaceholder')}
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            elevation={1}
          />
        </View>

        {isLoading && !isRefetching ? (
          <ActivityIndicator size="large" style={styles.fullScreenLoader} />
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Icon name="alert-circle-outline" size={60} color={colors.error} />
            <Title style={{ color: colors.error }}>{i18n.t('common.errorTitle')}</Title>
            <Subheading>{(error as Error).message}</Subheading>
            <Button onPress={handleRefresh} style={{ marginTop: 20 }}>{i18n.t('common.retry')}</Button>
          </View>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={<EmptyState onReset={resetAll} />}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
          />
        )}

        <FilterModal
          visible={isFilterModalVisible}
          onDismiss={() => setFilterModalVisible(false)}
          applyFilters={handleApplyFilters}
          initialFilters={initialFilters}
          availableCategories={MOCK_CATEGORIES}
          availableAccounts={MOCK_ACCOUNTS}
        />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('AddTransaction')} // For manual transaction entry
          label={i18n.t('transactions.addManual')}
          visible={true}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 80, // Space for FAB
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: height * 0.6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  // Item styles
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  itemDetailsContainer: {
    flex: 1,
  },
  itemMerchant: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemCategory: {
    fontSize: 13,
  },
  itemAmountContainer: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 12,
  },
  // Modal styles
  modalContainer: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  datePickerText: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    textAlign: 'center',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    margin: 4,
  },
});

export default TransactionsScreen;
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useWallet, Transaction } from '../src/contexts/WalletContext';

// Filter options for transactions
type FilterType = 'all' | 'topup' | 'purchase' | 'transfer';

export default function TransactionHistory() {
  const { transactions } = useWallet();
  const [filter, setFilter] = useState<FilterType>('all');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

  // Filter transactions based on selected filter
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      if (filter === 'all') {
        setFilteredTransactions(transactions);
      } else {
        setFilteredTransactions(transactions.filter(transaction => transaction.type === filter));
      }
      setIsLoading(false);
    }, 500);
  }, [filter, transactions]);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get icon based on transaction type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return { name: 'wallet', color: '#4CAF50', background: 'rgba(76, 175, 80, 0.1)' };
      case 'purchase':
        return { name: 'cart', color: '#2196F3', background: 'rgba(33, 150, 243, 0.1)' };
      case 'transfer':
        return { name: 'swap-horizontal', color: '#9C27B0', background: 'rgba(156, 39, 176, 0.1)' };
      case 'refund':
        return { name: 'return-down-back', color: '#FF9800', background: 'rgba(255, 152, 0, 0.1)' };
      default:
        return { name: 'cash', color: '#607D8B', background: 'rgba(96, 125, 139, 0.1)' };
    }
  };

  // Get amount color based on transaction type
  const getAmountColor = (type: string) => {
    switch (type) {
      case 'topup':
      case 'refund':
        return '#4CAF50'; // Green for incoming money
      case 'purchase':
      case 'transfer':
        return '#F44336'; // Red for outgoing money
      default:
        return '#607D8B'; // Grey for neutral
    }
  };

  // Get amount prefix based on transaction type
  const getAmountPrefix = (type: string) => {
    switch (type) {
      case 'topup':
      case 'refund':
        return '+';
      case 'purchase':
      case 'transfer':
        return '-';
      default:
        return '';
    }
  };

  // Format transaction type to display name
  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'topup':
        return 'Top Up';
      case 'purchase':
        return 'Purchase';
      case 'transfer':
        return 'Transfer';
      case 'refund':
        return 'Refund';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Toggle transaction details expansion
  const toggleTransactionDetails = (id: string) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(id);
    }
  };

  // Render transaction item
  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const icon = getTransactionIcon(item.type);
    const amountColor = getAmountColor(item.type);
    const amountPrefix = getAmountPrefix(item.type);
    const isExpanded = expandedTransaction === item.id;

    return (
      <Animated.View
        entering={FadeInDown.delay(200).duration(500)}
        style={styles.transactionCard}>
        <Pressable 
          style={styles.transactionCardContent}
          onPress={() => toggleTransactionDetails(item.id)}>
          <View style={styles.transactionLeft}>
            <View style={[styles.transactionIconContainer, { backgroundColor: icon.background }]}>
              <Ionicons name={icon.name as any} size={20} color={icon.color} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{item.description}</Text>
              <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
            </View>
          </View>
          <View style={styles.transactionRight}>
            <Text style={[styles.transactionAmount, { color: amountColor }]}>
              {amountPrefix}E{item.amount.toFixed(2)}
            </Text>
            <Ionicons 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color="rgba(255,255,255,0.5)" 
            />
          </View>
        </Pressable>

        {isExpanded && (
          <View style={styles.transactionDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{item.id.substring(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{formatTransactionType(item.type)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: item.status === 'completed' ? '#4CAF50' : 
                                    item.status === 'pending' ? '#FFC107' : '#F44336' }
                ]} />
                <Text style={styles.detailValue}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>
            {item.reference && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Reference</Text>
                <Text style={styles.detailValue}>{item.reference}</Text>
              </View>
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  // Render empty state when no transactions match filter
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={80} color="rgba(255,255,255,0.2)" />
      <Text style={styles.emptyTitle}>No Transactions</Text>
      <Text style={styles.emptyText}>
        {filter === 'all' 
          ? "You don't have any transactions yet." 
          : `You don't have any ${formatTransactionType(filter).toLowerCase()} transactions.`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1', '#01579b']}
        style={[StyleSheet.absoluteFill, styles.gradient]}
      />

      {/* Header */}
      <Animated.View 
        entering={FadeIn.delay(200).duration(1000)}
        style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Transaction History</Text>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View 
        entering={FadeInDown.delay(300).duration(1000)}
        style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabs}>
          <Pressable 
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}>
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
          </Pressable>
          <Pressable 
            style={[styles.filterTab, filter === 'topup' && styles.filterTabActive]}
            onPress={() => setFilter('topup')}>
            <Text style={[styles.filterText, filter === 'topup' && styles.filterTextActive]}>Top Up</Text>
          </Pressable>
          <Pressable 
            style={[styles.filterTab, filter === 'purchase' && styles.filterTabActive]}
            onPress={() => setFilter('purchase')}>
            <Text style={[styles.filterText, filter === 'purchase' && styles.filterTextActive]}>Purchases</Text>
          </Pressable>
          <Pressable 
            style={[styles.filterTab, filter === 'transfer' && styles.filterTabActive]}
            onPress={() => setFilter('transfer')}>
            <Text style={[styles.filterText, filter === 'transfer' && styles.filterTextActive]}>Transfers</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>

      {/* Transactions List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.transactionsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTabs: {
    paddingRight: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  filterTabActive: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#1a237e',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  transactionsList: {
    padding: 16,
    paddingBottom: 100,
  },
  transactionCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  transactionCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

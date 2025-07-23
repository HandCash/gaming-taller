import Lock from '../models/lock';

export async function withLock<T>(
    lockName: string,
    timeoutMs: number,
    callback: () => Promise<T>,
    retryIntervalMs: number = 100
): Promise<T> {
    const startTime = Date.now();
    
    while (true) {
        try {
            const lockExpiryTime = new Date(Date.now() + timeoutMs);
            
            // Try to acquire lock
            await Lock.create({
                name: lockName,
                expiresAt: lockExpiryTime
            });

            try {
                // Execute the callback if lock was acquired
                return await callback();
            } finally {
                // Always clean up the lock
                await Lock.deleteOne({ name: lockName });
            }
        } catch (error: any) {
            // If error is duplicate key error, lock is already held
            if (error.code === 11000) {
                // Check if we've exceeded the timeout
                if (Date.now() - startTime >= timeoutMs) {
                    throw new Error(`Timeout waiting for lock ${lockName}`);
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, retryIntervalMs));
                continue;
            }
            throw error;
        }
    }
} 